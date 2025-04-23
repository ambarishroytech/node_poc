-- Create the database
CREATE DATABASE GroupMessagingDB;
GO

-- Use the newly created database
USE GroupMessagingDB;
GO

-- Drop and recreate the Users table
IF OBJECT_ID('Users', 'U') IS NOT NULL
    DROP TABLE Users;
GO

CREATE TABLE Users (
    user_id INT PRIMARY KEY IDENTITY(1,1),
    email NVARCHAR(255) UNIQUE NOT NULL,
    password_hash NVARCHAR(512) NOT NULL,
    registration_timestamp DATETIME DEFAULT GETUTCDATE()
);
GO

-- Drop and recreate the RefGroupTypes table
IF OBJECT_ID('RefGroupTypes', 'U') IS NOT NULL
    DROP TABLE RefGroupTypes;
GO

CREATE TABLE RefGroupTypes (
    ref_group_type_id INT PRIMARY KEY IDENTITY(1,1),
    ref_group_type_name NVARCHAR(50) NOT NULL UNIQUE, -- Group type name (e.g., Private, Open)
    is_restricted BIT NOT NULL -- Indicates if the group type is restricted (e.g., Private = 1, Open = 0)
);
GO

-- Insert default values into RefGroupTypes
INSERT INTO RefGroupTypes (ref_group_type_name, is_restricted)
VALUES 
    ('Private', 1), -- Restricted group type
    ('Open', 0);    -- Non-restricted group type
GO

-- Drop and recreate the Groups table
IF OBJECT_ID('Groups', 'U') IS NOT NULL
    DROP TABLE Groups;
GO

CREATE TABLE Groups (
    group_id INT PRIMARY KEY IDENTITY(1,1),
    group_name NVARCHAR(255) NOT NULL,
    ref_group_type_id INT NOT NULL, -- Foreign key to RefGroupTypes
    owner_id INT NOT NULL,
    max_members INT,
    creation_timestamp DATETIME DEFAULT GETUTCDATE(),
    last_updated DATETIME DEFAULT GETUTCDATE(), -- Track changes
    FOREIGN KEY (ref_group_type_id) REFERENCES RefGroupTypes(ref_group_type_id),
    FOREIGN KEY (owner_id) REFERENCES Users(user_id)
);
GO

-- Drop and recreate the GroupMembers table
IF OBJECT_ID('GroupMembers', 'U') IS NOT NULL
    DROP TABLE GroupMembers;
GO

CREATE TABLE GroupMembers (
    group_id INT NOT NULL,
    user_id INT NOT NULL,
    is_owner BIT DEFAULT 0, -- Indicates if the user is the owner of the group
    join_timestamp DATETIME DEFAULT GETUTCDATE(),
    PRIMARY KEY (group_id, user_id),
    FOREIGN KEY (group_id) REFERENCES Groups(group_id),
    FOREIGN KEY (user_id) REFERENCES Users(user_id)
);
GO

-- Drop and recreate the GroupMembers table
IF OBJECT_ID('GroupLeaveHistory ', 'U') IS NOT NULL
    DROP TABLE GroupLeaveHistory ;
GO

CREATE TABLE GroupLeaveHistory  (
    group_id INT NOT NULL,
    user_id INT NOT NULL,
    leave_timestamp DATETIME DEFAULT GETUTCDATE(), -- To track when a user leaves a private group for cool down
    PRIMARY KEY (group_id, user_id),
    FOREIGN KEY (group_id) REFERENCES Groups(group_id),
    FOREIGN KEY (user_id) REFERENCES Users(user_id)
);
GO

-- Drop and recreate the RefJoinRequestStatuses table
IF OBJECT_ID('RefJoinRequestStatuses', 'U') IS NOT NULL
    DROP TABLE RefJoinRequestStatuses;
GO

CREATE TABLE RefJoinRequestStatuses (
    ref_join_request_status_id INT PRIMARY KEY IDENTITY(1,1),
    ref_join_request_status_name NVARCHAR(50) NOT NULL UNIQUE, -- Status name (e.g., pending, approved, declined)
    is_default BIT NOT NULL -- Indicates if this is the default status
);
GO

-- Insert default values into RefJoinRequestStatuses
INSERT INTO RefJoinRequestStatuses (ref_join_request_status_name, is_default)
VALUES 
    ('pending', 1),  -- Default status
    ('approved', 0), -- Non-default status
    ('declined', 0); -- Non-default status
GO

-- Drop and recreate the JoinRequests table
IF OBJECT_ID('JoinRequests', 'U') IS NOT NULL
    DROP TABLE JoinRequests;
GO

CREATE TABLE JoinRequests (
    request_id INT PRIMARY KEY IDENTITY(1,1),
    group_id INT NOT NULL,
    user_id INT NOT NULL,
    request_timestamp DATETIME DEFAULT GETUTCDATE(),
    ref_join_request_status_id INT NOT NULL, -- Foreign key to RefJoinRequestStatuses
	status_change_timestamp DATETIME DEFAULT GETUTCDATE(),
	comments NVARCHAR(255) NOT NULL,
    FOREIGN KEY (group_id) REFERENCES Groups(group_id),
    FOREIGN KEY (user_id) REFERENCES Users(user_id),
    FOREIGN KEY (ref_join_request_status_id) REFERENCES RefJoinRequestStatuses(ref_join_request_status_id),
    UNIQUE (group_id, user_id) -- Prevent duplicate join requests for the same group by the same user
);
GO

-- Drop and recreate the Banishments table
IF OBJECT_ID('Banishments', 'U') IS NOT NULL
    DROP TABLE Banishments;
GO

CREATE TABLE Banishments (
    banishment_id INT PRIMARY KEY IDENTITY(1,1),
    group_id INT NOT NULL,
    user_id INT NOT NULL,
    banishment_timestamp DATETIME DEFAULT GETUTCDATE(),
    comments NVARCHAR(255) NOT NULL,
    FOREIGN KEY (group_id) REFERENCES Groups(group_id),
    FOREIGN KEY (user_id) REFERENCES Users(user_id),
    UNIQUE (group_id, user_id) -- Ensure a user can only be banished once from a group at a time
);
GO

-- Drop and recreate the Messages table
IF OBJECT_ID('Messages', 'U') IS NOT NULL
    DROP TABLE Messages;
GO

CREATE TABLE Messages (
    message_id INT PRIMARY KEY IDENTITY(1,1),
    group_id INT NOT NULL,
    sender_id INT NOT NULL,
    content_encrypted VARBINARY(MAX) NOT NULL, -- Store encrypted message content
    timestamp DATETIME DEFAULT GETUTCDATE(),
    last_updated DATETIME DEFAULT GETUTCDATE(), -- Track changes
    FOREIGN KEY (group_id) REFERENCES Groups(group_id),
    FOREIGN KEY (sender_id) REFERENCES Users(user_id)
);
GO

---------------------------
-- non-clustered indexes for performance optimization

-- Index on Groups(ref_group_type_id) for filtering by group type
CREATE NONCLUSTERED INDEX IX_Groups_RefGroupTypeId ON Groups (ref_group_type_id);
GO

-- Index on JoinRequests(ref_join_request_status_id) for filtering by status
CREATE NONCLUSTERED INDEX IX_JoinRequests_StatusId ON JoinRequests (ref_join_request_status_id);
GO

-- Composite index on Messages(group_id, timestamp) for retrieving messages by group and time
CREATE NONCLUSTERED INDEX IX_Messages_GroupId_Timestamp ON Messages (group_id, timestamp);
GO

-- Index on GroupMembers(user_id) for filtering by user
CREATE NONCLUSTERED INDEX IX_GroupMembers_UserId ON GroupMembers (user_id);
GO

---------------------------
-- Stored Procedures

CREATE PROCEDURE SP_RegisterUser
    @Email NVARCHAR(255),
    @PasswordHash NVARCHAR(512)
AS
BEGIN
    BEGIN TRY
        BEGIN TRANSACTION;

        -- Check if the email already exists
        IF EXISTS (SELECT 1 FROM Users WHERE email = @Email)
        BEGIN
            -- Custom error number must be greater than 50000
            THROW 50001, 'Email address already exists.', 1;
        END

        -- Insert the new user
        INSERT INTO Users (email, password_hash)
        VALUES (@Email, @PasswordHash);

        -- Commit the transaction
        COMMIT TRANSACTION;
    END TRY
    BEGIN CATCH
        -- Rollback the transaction in case of an error
        ROLLBACK TRANSACTION;

        -- Re-throw the error with the original message
        THROW;
    END CATCH
END;
GO

CREATE PROCEDURE SP_GetUser
    @Email NVARCHAR(255)
AS
BEGIN
    BEGIN TRY
        SET NOCOUNT ON;

        -- Check if the email already exists
        IF NOT EXISTS (SELECT 1 FROM Users WHERE email = @Email)
        BEGIN
            THROW 50001, 'User is not registered.', 1;
        END

        SELECT user_id, email, password_hash
        FROM Users
        WHERE email = @Email;
    END TRY
    BEGIN CATCH
        THROW;
    END CATCH
END;
GO

CREATE PROCEDURE SP_CreateGroup
    @GroupName NVARCHAR(255),
    @RefGroupTypeId INT,
    @OwnerId INT,
    @MaxMembers INT
AS
BEGIN
    BEGIN TRY
        BEGIN TRANSACTION;

        INSERT INTO Groups (group_name, ref_group_type_id, owner_id, max_members)
        VALUES (@GroupName, @RefGroupTypeId, @OwnerId, @MaxMembers);

        DECLARE @GroupId INT;
        SELECT @GroupId = SCOPE_IDENTITY();

        INSERT INTO GroupMembers (group_id, user_id, is_owner)
        VALUES (@GroupId, @OwnerId, 1);

        COMMIT TRANSACTION;
    END TRY
    BEGIN CATCH
        ROLLBACK TRANSACTION;

        -- Use RAISERROR for dynamic error messages
        DECLARE @ErrorMessage NVARCHAR(4000) = 'Error occurred during group creation: ' + ERROR_MESSAGE();
        RAISERROR (@ErrorMessage, 16, 1);
    END CATCH
END;
GO

CREATE PROCEDURE SP_JoinGroup
    @GroupId INT,
    @UserId INT
AS
BEGIN
    BEGIN TRY
        BEGIN TRANSACTION;

		DECLARE @MaxMembers INT;
        DECLARE @CurrentMembers INT;

		-- Check the current number of members in the group
        SELECT @CurrentMembers = COUNT(*)
        FROM GroupMembers
        WHERE group_id = @GroupId;

        -- If the current number of members is equal to or greater than max_members, throw an error
        IF @CurrentMembers >= @MaxMembers
        BEGIN
            THROW 50001, 'The group has already reached its maximum number of members.', 1;
        END;

		IF EXISTS (SELECT 1 FROM GroupLeaveHistory WHERE group_id = @GroupId AND user_id = @UserId AND DATEDIFF(HOUR, leave_timestamp, GETUTCDATE()) < 48)
        BEGIN
            THROW 50002, 'User must wait 48 hours before requesting to join the group again.', 1;
        END;

        DECLARE @IsRestricted BIT;

        SELECT @IsRestricted = is_restricted
        FROM RefGroupTypes
        INNER JOIN Groups ON Groups.ref_group_type_id = RefGroupTypes.ref_group_type_id
        WHERE Groups.group_id = @GroupId;

		-- Check from GroupLeaveHistory against group_id, user_id if the leave_timestamp is 48hrs old or not, 
			--if found and not yet crossed 48 hrs then throw an error

        IF @IsRestricted = 1
        BEGIN
            -- Get the status ID for 'pending'
            DECLARE @PendingStatusId INT;
            SELECT @PendingStatusId = ref_join_request_status_id
            FROM RefJoinRequestStatuses
            WHERE ref_join_request_status_name = 'pending';

            -- Check if a join request already exists for this user and group
            IF EXISTS (SELECT 1 FROM JoinRequests WHERE group_id = @GroupId AND user_id = @UserId AND ref_join_request_status_id = @PendingStatusId)
            BEGIN
                -- Use RAISERROR for informative error messages
                THROW 50003, 'A join request for this group and user already exists.', 1;
            END;

            INSERT INTO JoinRequests (group_id, user_id)
            VALUES (@GroupId, @UserId);
        END
        ELSE
        BEGIN
            -- Check if the user is already a member of the group
            IF EXISTS (SELECT 1 FROM GroupMembers WHERE group_id = @GroupId AND user_id = @UserId)
            BEGIN
                -- Use RAISERROR for informative error messages
                THROW 50004, 'User is already a member of this group.', 1;
            END;

            -- Check if the user was banished or not
            IF EXISTS (SELECT 1 FROM Banishments WHERE group_id = @GroupId AND user_id = @UserId)
            BEGIN
                -- Use RAISERROR for informative error messages
                THROW 50005, 'As a banished user you have to raise a join request.', 1;
            END;

            INSERT INTO GroupMembers (group_id, user_id)
            VALUES (@GroupId, @UserId);
        END

        COMMIT TRANSACTION;
    END TRY
    BEGIN CATCH
        ROLLBACK TRANSACTION;

        -- Use RAISERROR for dynamic error messages
        DECLARE @ErrorMessage NVARCHAR(4000) = 'Error occurred during group join: ' + ERROR_MESSAGE();
        RAISERROR (@ErrorMessage, 16, 1);
    END CATCH
END;
GO

CREATE PROCEDURE SP_UpdateJoinRequest
    @RequestId INT,
    @RefJoinRequestStatusId INT,
	@Comments NVARCHAR(255)
AS
BEGIN
    BEGIN TRY
        BEGIN TRANSACTION;

		-- Get the status ID for 'pending'
        DECLARE @PendingStatusId INT;
        DECLARE @ApprovedStatusId INT;

        SELECT @PendingStatusId = ref_join_request_status_id
        FROM RefJoinRequestStatuses
        WHERE ref_join_request_status_name = 'pending';

        SELECT @ApprovedStatusId = ref_join_request_status_id
        FROM RefJoinRequestStatuses
        WHERE ref_join_request_status_name = 'approved';

        -- Check if the join request exists
        IF NOT EXISTS (SELECT 1 FROM JoinRequests WHERE request_id = @RequestId)
        BEGIN
            THROW 50003, 'Join request not found.', 1;
        END

		-- Check if the join request status is pending or not
        IF NOT EXISTS (SELECT 1 FROM JoinRequests WHERE request_id = @RequestId AND ref_join_request_status_id = @PendingStatusId)
        BEGIN
            THROW 50004, 'Join request status has already been changed.', 1;
        END

        -- Check if the provided status ID exists in RefJoinRequestStatuses
        IF NOT EXISTS (SELECT 1 FROM RefJoinRequestStatuses WHERE ref_join_request_status_id = @RefJoinRequestStatusId)
        BEGIN
            THROW 50006, 'Invalid join request status ID.', 1;
        END

        -- Update the join request status
        UPDATE JoinRequests
        SET ref_join_request_status_id = @RefJoinRequestStatusId, comments = @Comments, status_change_timestamp = GETUTCDATE()
        WHERE request_id = @RequestId;

        -- Final work
        IF @RefJoinRequestStatusId = @ApprovedStatusId
        BEGIN

            DECLARE @GroupId INT;
            DECLARE @UserId INT;
            SELECT @GroupId = group_id, @UserId=user_id FROM JoinRequests WHERE request_id = @RequestId

            INSERT INTO GroupMembers (group_id, user_id)
            VALUES (@GroupId, @UserId);

            DELETE Banishments WHERE group_id = @GroupId AND user_id = @UserId;
        END

        -- Commit the transaction
        COMMIT TRANSACTION;
    END TRY
    BEGIN CATCH
        -- Rollback the transaction in case of an error
        ROLLBACK TRANSACTION;

        -- Raise a detailed error message
        DECLARE @ErrorMessage NVARCHAR(4000) = 'Error occurred during join request update: ' + ERROR_MESSAGE();
        RAISERROR (@ErrorMessage, 16, 1);
    END CATCH
END;
GO

CREATE PROCEDURE SP_GetPendingJoinRequests
    @GroupId INT
AS
BEGIN
    BEGIN TRY
        SET NOCOUNT ON;

        -- Get the status ID for 'pending'
        DECLARE @PendingStatusId INT;
        SELECT @PendingStatusId = ref_join_request_status_id
        FROM RefJoinRequestStatuses
        WHERE ref_join_request_status_name = 'pending';

        -- Retrieve pending join requests for the specified group
        SELECT request_id, user_id, request_timestamp
        FROM JoinRequests
        WHERE group_id = @GroupId AND ref_join_request_status_id = @PendingStatusId;
    END TRY
    BEGIN CATCH
        -- Raise a detailed error message
        DECLARE @ErrorMessage NVARCHAR(4000) = 'Error occurred while retrieving pending join requests: ' + ERROR_MESSAGE();
        RAISERROR (@ErrorMessage, 16, 1);
    END CATCH
END;
GO

CREATE PROCEDURE SP_LeaveGroup
    @GroupId INT,
    @UserId INT
AS
BEGIN
    BEGIN TRY
        BEGIN TRANSACTION;

        DELETE FROM GroupMembers
        WHERE group_id = @GroupId AND user_id = @UserId;

		INSERT INTO GroupLeaveHistory (group_id, user_id) VALUES (@GroupId, @UserId);

        COMMIT TRANSACTION;
    END TRY
    BEGIN CATCH
        ROLLBACK TRANSACTION;

        DECLARE @ErrorMessage NVARCHAR(4000) = 'Error occurred during group leave: ' + ERROR_MESSAGE();
        RAISERROR (@ErrorMessage, 16, 1);
    END CATCH
END;
GO

CREATE PROCEDURE SP_BanishMember
    @GroupId INT,
    @UserId INT,
	@Comments NVARCHAR(255)
AS
BEGIN
    BEGIN TRY
        BEGIN TRANSACTION;

        DELETE FROM GroupMembers
        WHERE group_id = @GroupId AND user_id = @UserId;

        INSERT INTO Banishments (group_id, user_id, comments)
        VALUES (@GroupId, @UserId, @Comments);

        COMMIT TRANSACTION;
    END TRY
    BEGIN CATCH
        ROLLBACK TRANSACTION;

        DECLARE @ErrorMessage NVARCHAR(4000) = 'Error occurred during member banishment: ' + ERROR_MESSAGE();
        RAISERROR (@ErrorMessage, 16, 1);
    END CATCH
END;
GO

CREATE PROCEDURE SP_TransferOwnership
    @GroupId INT,
    @OwnerId INT,
    @NewOwnerId INT
AS
BEGIN
    BEGIN TRY
        BEGIN TRANSACTION;

        IF NOT EXISTS (SELECT 1 FROM GroupMembers WHERE group_id = @GroupId AND user_id = @NewOwnerId)
        BEGIN
            THROW 50004, 'New owner must be a member of the group.', 1;
        END

        UPDATE Groups
        SET owner_id = @NewOwnerId
        WHERE group_id = @GroupId;

        UPDATE GroupMembers
        SET user_id = @NewOwnerId
        WHERE group_id = @GroupId AND user_id = @OwnerId;

        COMMIT TRANSACTION;
    END TRY
    BEGIN CATCH
        ROLLBACK TRANSACTION;

        DECLARE @ErrorMessage NVARCHAR(4000) = 'Error occurred during ownership transfer: ' + ERROR_MESSAGE();
        RAISERROR (@ErrorMessage, 16, 1);
    END CATCH
END;
GO

CREATE PROCEDURE SP_DeleteGroup
    @GroupId INT
AS
BEGIN
    BEGIN TRY
        BEGIN TRANSACTION;

        IF EXISTS (SELECT 1 FROM GroupMembers WHERE group_id = @GroupId AND user_id != (SELECT owner_id FROM Groups WHERE group_id = @GroupId))
        BEGIN
            THROW 50005, 'Cannot delete group with other members.', 1;
        END

        DELETE FROM Groups
        WHERE group_id = @GroupId;

        COMMIT TRANSACTION;
    END TRY
    BEGIN CATCH
        ROLLBACK TRANSACTION;

        DECLARE @ErrorMessage NVARCHAR(4000) = 'Error occurred during group deletion: ' + ERROR_MESSAGE();
        RAISERROR (@ErrorMessage, 16, 1);
    END CATCH
END;
GO

CREATE PROCEDURE SP_SendMessage
    @GroupId INT,
    @SenderId INT,
    @ContentEncrypted VARBINARY(MAX)
AS
BEGIN
    BEGIN TRY
        BEGIN TRANSACTION;

        

        INSERT INTO Messages (group_id, sender_id, content_encrypted)
        VALUES (@GroupId, @SenderId, @ContentEncrypted);

        COMMIT TRANSACTION;
    END TRY
    BEGIN CATCH
        ROLLBACK TRANSACTION;

        -- Use RAISERROR for dynamic error messages
        DECLARE @ErrorMessage NVARCHAR(4000) = 'Error occurred during message sending: ' + ERROR_MESSAGE();
        RAISERROR (@ErrorMessage, 16, 1);
    END CATCH
END;
GO

CREATE PROCEDURE SP_RetrieveMessages
    @GroupId INT,
    @PageNumber INT = NULL, -- Optional parameter for pagination
    @PageSize INT = NULL    -- Optional parameter for pagination
AS
BEGIN
    BEGIN TRY
        SET NOCOUNT ON;

        -- Check if pagination parameters are provided
        IF @PageNumber IS NOT NULL AND @PageSize IS NOT NULL
        BEGIN
            -- Paginated retrieval of messages
            SELECT message_id, sender_id, content_encrypted, timestamp
            FROM Messages
            WHERE group_id = @GroupId
            ORDER BY timestamp DESC
            OFFSET (@PageNumber - 1) * @PageSize ROWS
            FETCH NEXT @PageSize ROWS ONLY;
        END
        ELSE
        BEGIN
            -- Non-paginated retrieval of all messages
            SELECT message_id, sender_id, content_encrypted, timestamp
            FROM Messages
            WHERE group_id = @GroupId
            ORDER BY timestamp DESC;
        END
    END TRY
    BEGIN CATCH
        -- Raise a detailed error message
        DECLARE @ErrorMessage NVARCHAR(4000) = 'Error occurred while retrieving messages: ' + ERROR_MESSAGE();
        RAISERROR (@ErrorMessage, 16, 1);
    END CATCH
END;
GO

CREATE PROCEDURE SP_GetRefGroupTypes
AS
BEGIN
    BEGIN TRY
        SET NOCOUNT ON;

        SELECT ref_group_type_id, ref_group_type_name, is_restricted
        FROM RefGroupTypes
        ORDER BY ref_group_type_id;
    END TRY
    BEGIN CATCH
        -- Raise a detailed error message
        DECLARE @ErrorMessage NVARCHAR(4000) = 'Error occurred while retrieving group types: ' + ERROR_MESSAGE();
        RAISERROR (@ErrorMessage, 16, 1);
    END CATCH
END;
GO

CREATE PROCEDURE SP_GetRefJoinRequestStatuses
AS
BEGIN
    BEGIN TRY
        SET NOCOUNT ON;

        SELECT ref_join_request_status_id, ref_join_request_status_name, is_default
        FROM RefJoinRequestStatuses
        ORDER BY ref_join_request_status_id;
    END TRY
    BEGIN CATCH
        -- Raise a detailed error message
        DECLARE @ErrorMessage NVARCHAR(4000) = 'Error occurred while retrieving join request statuses: ' + ERROR_MESSAGE();
        RAISERROR (@ErrorMessage, 16, 1);
    END CATCH
END;
GO