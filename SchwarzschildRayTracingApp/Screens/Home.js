import React from 'react'
import axios from 'axios';
import { StyleSheet, Text, View } from 'react-native';

function Home() {

    const requestRayTrace = (x, y, delta0) => {
        const toSend = {
            x : x,
            y : y,
            delta0 : delta0
        };

        let config = {
            headers: {
                "Content-Type": "application/json",
                'Access-Control-Allow-Origin': '*',
            }
        }

        axios.post(
            "http://localhost:8000",
            toSend,
            config
        )
            .then(response => {
                let x_trace = []
                let y_trace = []
                let z_trace = []
                let delta = []

                response.data.forEach(obj => {
                    x_trace.push(obj["x"])
                    y_trace.push(obj["y"])
                    z_trace.push(obj["z"])
                    delta.push(obj["dela"])
                });
            })

            .catch(function (error) {
                console.log(error);
            });
    }

    return (
        <div>
            
        </div>
    )
}

export default Home
