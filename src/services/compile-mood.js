const { modelName } = require("../domain/mood")
const createMoodDao = require("../domain/mood")

const compileMood = async (user, from, to) => {
    const moodDao = createMoodDao()
    const moods = await moodDao.find({
        user,
        reported: {
            $gte: new Date(from).setHours(0,0,0),
            $lte: new Date(to).setHours(23, 59, 59),
        }
    })

    const reportAmount = moods.length
    const averageMood = calculateAverageMood(moods)
    const bestWeekDay = findBestWeekDay(moods)
    const worstweekday = findWorstWeekDay(moods)
    const happiness = calculateHappiness(moods)
    const mostCommonTags = findMostCommonTags(moods, 5)
    const bestTime = findBestTime(moods)
    const worstTime = findWorstTime(moods)
    const mostCommonHappyTags = findMostCommonHappyTags(moods, 5)
    const mostCommonSadTags = findMostCommonSadTags(moods, 5)
    const dataPoints = moods.map(mood => {
        return {
            date: mood.reported,
            mood: mood.mood
        }
    })
    
    return {
        averageMood,
        bestWeekDay,
        worstweekday,
        bestTime,
        worstTime,
        happiness,
        reportAmount,
        mostCommonTags,
        mostCommonHappyTags,
        mostCommonSadTags,
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
    const times = new Array(24)
    times.fill(0)

    moods.forEach(mood => {
        times[mood.reported.getHours()] += mood.mood
    })

    let bestTime = -1
    times.forEach(time => {
        if (time > bestTime) bestTime = time
    })
    return bestTime
}

const findWorstWeekDay = moods => {
    const weekdays = [0, 0, 0, 0, 0, 0, 0]
    moods.forEach(mood => {
        weekdays[mood.reported.getDay()] += mood.mood
    })
    let worstweekday = 0
    for (let i = 0; i < weekdays.length; i++) {
        if ((weekdays[worstweekday] > weekdays[i] && weekdays[i] != 0) || weekdays[worstweekday] == 0) {
            worstweekday = i
        }
    }
    return worstweekday
}

const findWorstTime = moods => {
    const times = []
    for (let i = 0; i < 24; i++) {
        times.push(0)
    }
    moods.forEach(mood => {
        times[mood.reported.getHours()], mood.mood
    })

    let worstTime = Number.MAX_SAFE_INTEGER
    times.forEach(time => {
        if (time < worstTime) worstTime = time
    })
    return worstTime
}

const findMostCommonHappyTags = (moods, amount) => {
    const happyReports = moods.filter(mood => mood.mood >= 3)
    return findMostCommonTags(happyReports, amount)

}

const findMostCommonSadTags = (moods, amount) => {
    const sadReports = moods.filter(mood => mood.mood < 3)
    return findMostCommonTags(sadReports, amount)

}
module.exports = compileMood