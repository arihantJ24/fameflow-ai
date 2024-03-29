// Here we are using require because this is impure node js this has no realtion with react or any of the environment use in next 13. this is complete node file and will have no relation with any compoents inside. so that why we have to write in the different way.

const { PrismaClient } = require("@prisma/client")

const db = new PrismaClient();
async function main() {
    try {
        await db.category.createMany({
          data: [
            { name: "Famous People" },
            { name: "Engineer" },
            { name: "Doctor" },
            { name: "Philospher" },
            { name: "SportsMan" },
            { name: "Scientists" },
            { name: "Writer" },
          ],
        });
        
    }
    catch (error) {
        console.log("Error seeding default categories", error);
    }
    finally {
        await db.$disconnect();
    }
    
};

main();