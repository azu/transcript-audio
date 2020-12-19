import { createLiveTranscript } from "./LiveTranstruct";
import fixture from "./LiveTranstruct.test.json";

describe("LiveTranscript", function () {
    it("example", () => {
        const tr = createLiveTranscript();
        fixture.forEach((item) => {
            tr.add(item);
        });
        expect(tr.get()).toMatchSnapshot();
    });
});
