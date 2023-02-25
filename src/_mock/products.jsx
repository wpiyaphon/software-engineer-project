import { faker } from '@faker-js/faker';
import { sample } from 'lodash';

// ----------------------------------------------------------------------

const PRODUCT_NAME = [
    'Yuzu&Tofu Calender',
    'Room diffuser',
    'Enchanted Forest',
    'Raindrops on Roses',
    'Wisteria Cottage'
];

// ----------------------------------------------------------------------

const products = [...Array(5)].map((_, index) => {
    const setIndex = index + 1;

    return {
        id: faker.datatype.uuid(),
        cover: `/assets/images/products/product_${setIndex}.jpg`,
        name: PRODUCT_NAME[index],
        price: faker.datatype.number({ min: 4, max: 99, precision: 0.01 }),
        status: sample(['sale', 'new', 'pre-order']),
    };
});

export default products;
