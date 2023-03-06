import { Helmet } from "react-helmet-async";
// @mui
import { useTheme } from '@mui/material/styles';
import { Container, Typography, Stack, Grid } from "@mui/material";
// sections
import {
    AppWebsiteVisits,
    AppWidgetSummary,
} from '../sections/app';

import { initializeApp } from "firebase/app";
import {getFirestore, getCountFromServer, collection} from "firebase/firestore";
import { FIREBASE_API } from "../config";
import { useState, useEffect } from 'react';

export default function DashboardPage() {
    const app = initializeApp(FIREBASE_API);
    const db = getFirestore(app);

    const [customerCount, setCustomerCount] = useState(0)
    const [productCount, setProductCount] = useState(0)
    const [orderCount, setOrderCount] = useState(0)

    const fetchCustomerCount = async () => {
       
        const customerCount = await getCountFromServer(collection(db, "customers"))
        setCustomerCount(customerCount.data().count)
    }

    const fetchProductCount = async () => {
       
        const productCount = await getCountFromServer(collection(db, "products"))
        setProductCount(productCount.data().count)
    }

    const fetchOrderCount = async () => {
       
        const orderCount = await getCountFromServer(collection(db, "orders"))
        setOrderCount(orderCount.data().count)
    }
    
   
    useEffect(()=>{
        fetchCustomerCount();
        fetchProductCount();
        fetchOrderCount();
    }, [])
    

    return (
        <>
            <Helmet>
                <title>Dashboard</title>
            </Helmet>

            <Container>
                <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
                    <Typography variant="h4" gutterBottom>
                        Dashboard
                    </Typography>
                </Stack>

                <Grid container spacing={3}>
                    <Grid item xs={12} sm={6} md={4}>
                        <AppWidgetSummary title="Total Customers" total={714000} icon={'ant-design:android-filled'} />
                    <Grid item xs={12} sm={6} md={3}>
                        <AppWidgetSummary title="Weekly Sales" total={productCount} icon={'ant-design:android-filled'} />
                    </Grid>

                    <Grid item xs={12} sm={6} md={4}>
                        <AppWidgetSummary title="Total Products" total={1352831} color="info" icon={'ant-design:apple-filled'} />
                    <Grid item xs={12} sm={6} md={3}>
                        <AppWidgetSummary title="New Users" total={customerCount} color="info" icon={'ant-design:apple-filled'} />
                    </Grid>

                    <Grid item xs={12} sm={6} md={4}>
                        <AppWidgetSummary title="Total Orders" total={1723315} color="warning" icon={'ant-design:windows-filled'} />
                    <Grid item xs={12} sm={6} md={3}>
                        <AppWidgetSummary title="Item Orders" total={orderCount} color="warning" icon={'ant-design:windows-filled'} />
                    </Grid>

                    <Grid item xs={12} sm={6} md={3}>
                        <AppWidgetSummary title="Bug Reports" total={234} color="error" icon={'ant-design:bug-filled'} />
                    </Grid>

                    {/* <Grid item xs={12} md={12} lg={12}>
                        <AppWebsiteVisits
                            title="Product Sold"
                            subheader="(+43%) than last year"
                            chartLabels={[
                                '01/01/2003',
                                '02/01/2003',
                                '03/01/2003',
                                '04/01/2003',
                                '05/01/2003',
                                '06/01/2003',
                                '07/01/2003',
                                '08/01/2003',
                                '09/01/2003',
                                '10/01/2003',
                                '11/01/2003',
                            ]}
                            chartData={[
                                {
                                    name: 'Team A',
                                    type: 'column',
                                    fill: 'solid',
                                    data: [23, 11, 22, 27, 13, 22, 37, 21, 44, 22, 30],
                                },
                                {
                                    name: 'Team B',
                                    type: 'area',
                                    fill: 'gradient',
                                    data: [44, 55, 41, 67, 22, 43, 21, 41, 56, 27, 43],
                                },
                                {
                                    name: 'Team C',
                                    type: 'line',
                                    fill: 'solid',
                                    data: [30, 25, 36, 30, 45, 35, 64, 52, 59, 36, 39],
                                },
                            ]}
                        />
                    </Grid> */}
                </Grid>
            </Container>
        </>
    )
}