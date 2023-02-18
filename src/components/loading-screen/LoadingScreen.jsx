import { HalfMalf } from 'react-spinner-animated';

import './styles.css'

export default function LoadingScreen() {
    return (
        <HalfMalf
            center={true}
            width={"150px"}
            height={"150px"}
        />
    )
}