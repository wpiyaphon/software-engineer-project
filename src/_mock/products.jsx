import {collection, getDocs, query} from "firebase/firestore";
import db from "./firebase.js";

// ----------------------------------------------------------------------


class Product {
    constructor (name, cover, price, priceSale, colors, status, createdAt) {
        this.name = name
        this.cover = cover
        this.price = price
        this.priceSale = priceSale
        this.colors = colors
        this.status = status
        this.createdAt = createdAt
    }
    toString() {
        return this.name + ', ' + this.status;
    }
}

const productConverter = {
    toFirestore: (product) => {
        return {
            name: product.name,
            cover: product.cover,
            price: product.price,
            priceSale: product.priceSale,
            colors: product.colors,
            status: product.status,
            createdAt: product.createdAt
        };
    },
    fromFirestore: (snapshot, options) => {
        const data = snapshot.data(options);
        return new Product(data.name, data.cover, data.price, data.priceSale, data.colors, data.status, data.createdAt);
    }
};


const products = []
const q = query(collection(db, "products").withConverter(productConverter));

const querySnapshot = await getDocs(q);
querySnapshot.forEach((doc) => {
    // doc.data() is never undefined for query doc snapshots
    //console.log(doc.id, " => ", doc.data());
    const product = doc.data()
    products.push({
        id: doc.id,
        name: product.name,
        cover: product.cover,
        price: product.price,
        priceSale: product.priceSale,
        colors: product.colors,
        status: product.status,
        createdAt: product.createdAt
    })
});
export default products;
