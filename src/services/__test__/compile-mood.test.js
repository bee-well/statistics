const {config} = require("../../domain/mood")
const compileMood = require("../compile-mood")

it("fetches data with appropriate conditions", async () => {
    let findWasCalled = false
    config.model = {
        find: _ => {
            findWasCalled = true
            return [
                {
                    user: 1234,
                    mood: 1,
                    reported: new Date(2014, 5, 15, 0),
                    tags: ["happy", "sad", "exhausted"]
                },
                {
                    user: 1234,
                    mood: 3,
                    reported: new Date(2014, 5, 15, 0),
                    tags: ["happy"]
                },
                {
                    user: 1234,
                    mood: 2,
                    reported: new Date(2014, 5, 15, 1),
                    tags: ["sad"]
                },
                {
                    user: 1234,
                    mood: 5,
                    reported: new Date(2014, 5, 15, 2),
                    tags: ["happy"]
                }
            ]
        }
    }

    const result = await compileMood(1234, "2016-01-02", "2016-02-03")
    expect(result.averageMood).toEqual(3)
    expect(result.mostCommonTags[0]).toEqual("happy")
    expect(result.reportAmount).toEqual(4)
    expect(result.happiness).toEqual(25)
    expect(findWasCalled).toEqual(true)
    expect(result.worstTime).toEqual(1)
    expect(result.bestTime).toEqual(2)
    expect(result.worstweekday).toEqual(0)
    expect(result.mostCommonHappyTags[0]).toEqual("happy")
    expect(result.mostCommonSadTags[0]).toEqual("sad")
})