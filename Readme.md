##Steps to Run the Project

1.  Clone the project
2.  Install MySQl, Nodejs if you don't have
3.  npm i
4.  change your credentials in db config file
5.  Few things need to be pre-configured 1. Create Database in MySql name filefoldermanagement 2. Create Two tables run the below query
    CREATE TABLE `folder` (
    `id` INT(15) NOT NULL AUTO_INCREMENT,
    `virtualPath` VARCHAR(250),
    `parentFolderID` VARCHAR(250),
    `folderName` VARCHAR(50),
    PRIMARY KEY (`id`)
    );

        CREATE TABLE `file` (
        `id` INT(15) NOT NULL AUTO_INCREMENT,
        `fileName` VARCHAR(250),
        `folderID` VARCHAR(250),
        `filePath` VARCHAR(50),
        PRIMARY KEY (`id`)

    );

After running the above queries
if you wise you can change the directory path . From .env File

Task not Completed are as belows due to time constraint

1. Move File and Folder
2. sorting
3. Format of o/p is not done
4. Notify other users

To Run the Project
Do npm Start

For API Refer to Exported file from postman

Assignment.postman_collection.json
