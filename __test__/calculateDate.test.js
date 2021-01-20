import { calculateDaysToDate } from "../src/client/js/calculateDate";

it('tesing calculateDaysToDate function',() =>{
        let date = new Date('1-30-2021');
         expect(calculateDaysToDate(date)).toBe(10);
})