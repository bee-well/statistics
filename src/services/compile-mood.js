const { modelName } = require("../domain/mood")
const mood = require("../domain/mood")

const compileMood = async (user, from, to) => {
    const moods = await mood.find({
        user,
        reported: {
            $gte: new Date(from).setHours(00,00,00),
            $lte: new Date(to).setHours(23, 59, 59),
        }
    })

    const reportAmount = moods.length
    const averageMood = calculateAverageMood(moods)
    const bestWeekDay = findBestWeekDay(moods)
    const happiness = calculateHappiness(moods)
    const mostCommonTags = findMostCommonTags(moods, 5)
    const bestTime = findBestTime(moods)
    const dataPoints = moods.map(mood => {
        return {
            date: mood.reported,
            mood: mood.mood
        }
    })
    
    return {
        averageMood,
        bestWeekDay,
        bestTime,
        happiness,
        reportAmount,
        mostCommonTags,
        dataPoints
    }
}

const calculateAverageMood = moods => {
    if (moods.length === 0) return 0
    let total = 0
    moods.forEach(mood => {
        total += mood.mood
    })
    return Math.round(total / moods.length)
}

const findBestWeekDay = moods => {
    const weekdays = [0, 0, 0, 0, 0, 0, 0]
    moods.forEach(mood => {
        weekdays[mood.reported.getDay()] += mood.mood
    })
    let bestweekday = 0
    for (let i = 0; i < weekdays.length; i++) {
        if (weekdays[bestweekday] < weekdays[i]) {
            bestweekday = i
        }
    }
    return bestweekday
}

const calculateHappiness = moods => {
    let happyReportAmount = 0
    moods.forEach(mood => {
        if (mood.mood > 3) happyReportAmount++
    })
    return Math.round((happyReportAmount / moods.length) * 100)
}

const findMostCommonTags = (moods, amount) => {
    const map = new Map()
    moods.forEach(mood => {
        mood.tags.forEach(tag => {
            if (!map[tag]) {
                map[tag] = 1
            } else {
                map[tag]++
            }
        })
    })

    const mostCommonTags = []
    for (let i = 0; i < amount; i++) {
        const tag = findMostCommonTag(map)
        map[tag] = -1
        mostCommonTags.push(tag)
    }
    return mostCommonTags
}

const findMostCommonTag = map => {
    const mostCommon = ["", 0]
    for (let [key, value] of Object.entries(map)) {
        if (value > mostCommon[1]) {
            mostCommon[0] = key
            mostCommon[1] = value
        }
    }
    return mostCommon[0]
}

const findBestTime = moods => {
    const times = []
    for (let i = 0; i < 24; i++) {
        times.push(0)
    }
    moods.forEach(mood => {
        times[mood.reported.getHours()]++
    })

    let bestTime = -1
    times.forEach(time => {
        if (time > bestTime) bestTime = time
    })
    return bestTime
}

module.exports = compileMood