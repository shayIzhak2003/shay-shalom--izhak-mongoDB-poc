// Import required packages
const mongoose = require('mongoose');
const readline = require('readline');
const Table = require('cli-table3');
const { Property } = require('../schema/mainSchema');

// Connect to MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/propertiesDB', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => {
    console.log('Connected to MongoDB');
}).catch((err) => {
    console.error('MongoDB connection error:', err.message);
    process.exit(1);
});

// Setup readline interface
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});

let propertiesCache = []; // Cache to store properties with indices

function menu() {
    console.log(`\nChoose an action:\n`);
    console.log(`1. Add a property`);
    console.log(`2. Update a property by index`);
    console.log(`3. Delete a property`);
    console.log(`4. View all properties`);
    console.log(`5. Exit\n`);
    rl.question('Enter your choice: ', handleMenu);
}

async function handleMenu(choice) {
    switch (choice) {
        case '1':
            addProperty();
            break;
        case '2':
            await updatePropertyByIndex();
            break;
        case '3':
            deleteProperty();
            break;
        case '4':
            await viewProperties();
            break;
        case '5':
            rl.close();
            mongoose.connection.close();
            console.log('Goodbye!');
            break;
        default:
            console.log('Invalid choice, please try again.');
            menu();
            break;
    }
}

async function addProperty() {
    rl.question('Enter Name: ', (name) => {
        rl.question('Enter Subject: ', (subject) => {
            rl.question('Enter Description: ', (description) => {
                rl.question('Is Open (true/false): ', (isOpen) => {
                    rl.question('Enter Waiting Hours: ', async (waitingHours) => {
                        try {
                            const property = new Property({
                                name,
                                subject,
                                description,
                                isOpen: isOpen.toLowerCase() === 'true',
                                waitingHours: parseInt(waitingHours, 10),
                            });
                            await property.save();
                            console.log('Property added successfully!');
                        } catch (err) {
                            console.error('Error adding property:', err.message);
                        }
                        menu();
                    });
                });
            });
        });
    });
}

async function updatePropertyByIndex() {
    if (propertiesCache.length === 0) {
        console.log('No properties available. Please view the properties first.');
        menu();
        return;
    }

    rl.question('Enter the index of the property to update: ', (index) => {
        const property = propertiesCache[parseInt(index, 10)];
        if (!property) {
            console.log('Invalid index. Please try again.');
            menu();
            return;
        }

        rl.question('Enter field to update (name, subject, description, isOpen, waitingHours): ', (field) => {
            rl.question(`Enter new value for ${field}: `, async (value) => {
                try {
                    const updatedValue =
                        field === 'isOpen' ? value.toLowerCase() === 'true' :
                        field === 'waitingHours' ? parseInt(value, 10) :
                        value;
                    await Property.findByIdAndUpdate(property._id, { [field]: updatedValue }, { new: true });
                    console.log('Property updated successfully!');
                } catch (err) {
                    console.error('Error updating property:', err.message);
                }
                menu();
            });
        });
    });
}

async function deleteProperty() {
    rl.question('Enter the ID of the property to delete: ', async (id) => {
        try {
            await Property.findByIdAndDelete(id);
            console.log('Property deleted successfully!');
        } catch (err) {
            console.error('Error deleting property:', err.message);
        }
        menu();
    });
}

async function viewProperties() {
    try {
        const properties = await Property.find();
        propertiesCache = properties; // Cache the properties for index-based operations
        if (properties.length === 0) {
            console.log('No properties found.');
        } else {
            const table = new Table({
                head: ['Index', 'ID', 'Name', 'Subject', 'Description', 'Is Open', 'Waiting Hours'],
            });

            properties.forEach((property, index) => {
                table.push([
                    index,
                    property._id.toString(),
                    property.name,
                    property.subject,
                    property.description,
                    property.isOpen ? 'Yes' : 'No',
                    property.waitingHours,
                ]);
            });

            console.log(table.toString());
        }
    } catch (err) {
        console.error('Error fetching properties:', err.message);
    }
    menu();
}

// Start the application
menu();
