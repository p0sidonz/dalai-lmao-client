/* eslint-disable */

import { useEffect, useState } from 'react'
import axiosServices from '../../../utils/axios'

const useWater = () => {

    const [averages, setAverages] = useState({
        today: 0,
        week: 0,
        month: 0
    })
    const [getAll, setGetAll] = useState([])
    const [size, setSize] = useState(0)
    const [isLoading, setIsLoading] = useState(true)


    const getAvg = (array) => {
        let result = array.reduce((acc, obj) => {
            //@ts-ignore
            return acc + obj.value
        }, 0)
        return result / array.length || 0

    }



    let fetchTheData = async () => {
        axiosServices
            .get('water-rating/getAll')
            .then((r) => {
                console.log(r.data)
                setGetAll(r.data.today);
                //@ts-ignore
                setAverages({ ...averages, today: getAvg(r.data.today), week: getAvg(r.data.week), month: getAvg(r.data.month) })
                setIsLoading(false);
                //find the current interval in today array and get the value an set it to size
                const today = r.data.today
                const currentInterval = today.find((item) => {
                    return parseInt(item.interval) === r.data.interval
                })
                if (currentInterval) {
                    console.log(currentInterval)
                    setSize(currentInterval.value)
                } else {
                    setSize(0)
                }
            })
            .catch((err) => {
                console.log("error", err);
                setIsLoading(false);
            });
    }

    useEffect(() => {
        fetchTheData()
    }, [])

    return {
        averages,
        isLoading,

    }



}

export default useWater