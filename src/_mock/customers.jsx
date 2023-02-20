import db from "./firebase.js"
import { collection, query, getDocs } from "firebase/firestore";
// ----------------------------------------------------------------------


// ----------------------------------------------------------------------

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




const users = []
const q = query(collection(db, "customers").withConverter(customerConverter));

const querySnapshot = await getDocs(q);
querySnapshot.forEach((doc) => {
  // doc.data() is never undefined for query doc snapshots
  //console.log(doc.id, " => ", doc.data());
  const customer = doc.data()
  users.push({
    id: doc.id,
    avatarUrl: customer.avatarUrl,
    name: customer.name,
    company: customer.company,
    isVerified: customer.isVerified,
    status: customer.status,
    role: customer.role
  })
});

export default users;
