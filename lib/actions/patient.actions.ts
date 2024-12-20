"use server";

import { ID, InputFile, Query } from "node-appwrite";
import { database, DATABASE_ID, NEXT_PUBLIC_BUCKET_ID, NEXT_PUBLIC_ENDPOINT, PATIENT_COLLECTION_ID, PROJECT_ID, storage, users } from '../appwrite.config';
import { parseStringify } from '../utils';
import { Patient } from "@/types/appwrite.types";


// create a user
export const createUser = async (user: CreateUserParams) => {
    try {
        const newUser = await users.create(
            ID.unique(),
            user.email,
            user.phone,
            undefined,
            user.name,
        );

        return parseStringify(newUser)

    } catch (error: any) {
        if (error && error?.code === 409) {
            const existingUser = await users.list([
                Query.equal("email", [user.email])
            ])

            return existingUser.users[0];
        }
        console.log("An error occurred while creating a new user: ", error)
    }
}


// get user
export const getUser = async (userId: string) => {
    try {
        const user = await users.get(userId)

        return parseStringify(user);
    } catch (error) {
        console.log("An error occurred while retrieving the user details:", error)
    }
}

// REGISTER PATIENT
export const registerPatient = async ({ identificationDocument, ...patient }: Patient) => {
    try {
        // upload file
        let file;
        if (identificationDocument) {
            const inputFile = identificationDocument && InputFile.formBlob(identificationDocument?.get("blobFile") as Blob, identificationDocument?.get("fileName") as string);

            file = await storage.createFile(NEXT_PUBLIC_BUCKET_ID!, ID.unique(), inputFile);
        }

        // create new patient
        const newPatient = await database.createDocument(DATABASE_ID!,
            PATIENT_COLLECTION_ID!,
            ID.unique(), { identificationDocumentId: file?.$id ? file.$id : null, identificationDocumentUrl: file?.$id ? `${NEXT_PUBLIC_ENDPOINT}/storage/buckets/${NEXT_PUBLIC_BUCKET_ID}/files/${file.$id}/view??project=${PROJECT_ID}` : null, ...patient });

        return parseStringify(newPatient);

    } catch (error) {
        console.error("An error occurred while creating a new patient:", error);
    }
}

// GET PATIENT

export const getPatient = async (userId: string) => {
    try {
        const patients = await database.listDocuments(
            DATABASE_ID!,
            PATIENT_COLLECTION_ID!,
            [Query.equal("userId", [userId])]
        )

        return parseStringify(patients.documents[0]);

    } catch (error) {
        console.error(
            "An error occurred while retrieving the patient details:",
            error
        );
    }
}