
/*
import { faker } from '@faker-js/faker';
import db from "./firebase.js"
import {doc, setDoc, Timestamp} from "firebase/firestore";
// ----------------------------------------------------------------------
import pkg from 'lodash';
const { sample } = pkg;


class Customer {
    constructor (name, avatarUrl, company, isVerified, status, role, createdAt) {
        this.name = name
        this.avatarUrl = avatarUrl
        this.company = company
        this.isVerified = isVerified
        this.status = status
        this.role = role
        this.createdAt = createdAt
    }
    toString() {
        return this.name + ', ' + this.company + ', ' + this.role;
    }
}

const customerConverter = {
    toFirestore: (customer) => {
        return {
            name: customer.name,
            avatarUrl: customer.avatarUrl,
            company: customer.company,
            isVerified: customer.isVerified,
            status: customer.status,
            role: customer.role,
            createdAt: customer.createdAt
        };
    },
    fromFirestore: (snapshot, options) => {
        const data = snapshot.data(options);
        return new Customer(data.name, data.avatarUrl, data.company, data.isVerified, data.status, data.role, data.createdAt);
    }
};

for (let i = 0; i < 24; i++) {
  const ref = doc(db, "customers", faker.datatype.uuid()).withConverter(customerConverter);
  await setDoc(ref, new Customer(
      faker.name.fullName(),
      `/assets/images/avatars/avatar_default.jpg`,
      faker.company.name(),
      faker.datatype.boolean(),
      sample(['active', 'banned']),
      sample([
        'Leader',
        'Hr Manager',
        'UI Designer',
        'UX Designer',
        'UI/UX Designer',
        'Project Manager',
        'Backend Developer',
        'Full Stack Designer',
        'Front End Developer',
        'Full Stack Developer',
      ]),
      Timestamp.now()
  ))
      .then(() => console.log("User Added"))
      .catch((error) => console.error(error));
}

 */