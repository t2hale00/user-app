CREATE TABLE User (
    UserID INT PRIMARY KEY AUTO_INCREMENT,
    Username VARCHAR(255),
    Password VARCHAR(255),
    Email VARCHAR(255),
    AccountCreationDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE Parcel (
    ParcelID INT PRIMARY KEY AUTO_INCREMENT,
    SenderUserID INT,
    RecipientUserID INT NULL, -- Allowing NULL for recipients without a user account
    ParcelSizeWidth INT,
    ParcelSizeHeight INT,
    ParcelSizeDepth INT,
    ParcelMass DECIMAL(10,3),
    Status VARCHAR(50),
    PickupCode VARCHAR(4) UNIQUE, -- Pickup code associated with the parcel with UNIQUE constraint
    IsPickupCodeValid BOOLEAN DEFAULT TRUE, -- Flag to indicate whether the pickup code is valid
    DeliveryCode VARCHAR(4) UNIQUE, -- Delivery code associated with the parcel with UNIQUE constraint
    IsDeliveryCodeValid BOOLEAN DEFAULT TRUE, -- Flag to indicate whether the delivery code is valid
    PickupLocation INT,
    PickupDateTime TIMESTAMP,
    DeliveryDateTime TIMESTAMP,
    FOREIGN KEY (SenderUserID) REFERENCES User(UserID),
    FOREIGN KEY (RecipientUserID) REFERENCES User(UserID)
);

-- Add indexes to PickupCode and DeliveryCode columns
CREATE INDEX idx_pickupcode ON Parcel (PickupCode);
CREATE INDEX idx_deliverycode ON Parcel (DeliveryCode);                   

-- Create ParcelLocker Table
CREATE TABLE ParcelLocker (
    LockerID INT PRIMARY KEY AUTO_INCREMENT,
    Location VARCHAR(50)
);

-- Create Transaction Table
CREATE TABLE Transaction (
    TransactionID INT PRIMARY KEY AUTO_INCREMENT,
    UserID INT,
    ParcelID INT,
    TransactionType VARCHAR(50),
    TransactionDateTime TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    TransactionStatus VARCHAR(50),
    PickupLockerID INT, -- Can be NULL for delivery transactions
    DeliveryLockerID INT NULL, -- Allow NULL for delivery transactions
    IsRecipientNotified BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (UserID) REFERENCES User(UserID),
    FOREIGN KEY (ParcelID) REFERENCES Parcel(ParcelID),
    FOREIGN KEY (PickupLockerID) REFERENCES ParcelLocker(LockerID),
    FOREIGN KEY (DeliveryLockerID) REFERENCES ParcelLocker(LockerID)
);

-- Create Notification Table
CREATE TABLE Notification (
    NotificationID INT PRIMARY KEY AUTO_INCREMENT,
    UserID INT,
    NotificationType VARCHAR(50),
    Content TEXT,
    Timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (UserID) REFERENCES User(UserID)
);

-- Create Cabinet Table
CREATE TABLE Cabinet (
    CabinetID INT PRIMARY KEY AUTO_INCREMENT,
    LockerLocation VARCHAR(50), -- Location of the parcel locker
    CabinetNumber INT,
    Status VARCHAR(50),
    PickupCode VARCHAR(4), -- Pickup code associated with the cabinet
    DeliveryCode VARCHAR(4), -- Delivery code associated with the cabinet
    ParcelID INT, -- Reference to the currently associated parcel
    FOREIGN KEY (ParcelID) REFERENCES Parcel(ParcelID),
    FOREIGN KEY (PickupCode) REFERENCES Parcel(PickupCode), -- Reference to PickupCode in Parcel table
    FOREIGN KEY (DeliveryCode) REFERENCES Parcel(DeliveryCode) -- Reference to DeliveryCode in Parcel table
);
