const {config} = require("../../domain/mood")
const compileMood = require("../compile-mood")

it("fetches data with appropriate conditions", async () => {
    let findWasCalled = false
    config.model = {
        find: params => {
            findWasCalled = true
            return [
                {
                    user: 1234,
                    mood: 1,
                    reported: new Date(2014, 5, 15, 0),
                    tags: ["happy", "stressed", "exhausted"]
                },
                {
                    user: 1234,
                    mood: 3,
                    reported: new Date(2014, 5, 15, 0),
                    tags: ["happy"]
                }
            ]
        }
    }

    const result = await compileMood(1234, "2016-01-02", "2016-02-03")
    expect(result.averageMood).toEqual(2)
    expect(result.mostCommonTags[0]).toEqual("happy")
    expect(result.reportAmount).toEqual(2)
    expect(result.happiness).toEqual(0)
    expect(findWasCalled).toEqual(true)
})