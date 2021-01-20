import { calculateDaysToDate } from "../src/client/js/calculateDate";

it('tesing calculateDaysToDate function',() =>{
        let date1 = new Date('1-20-2021');
        let date2 = new Date('1-30-2021');
         expect(calculateDaysToDate(date1,date2)).toBe(10);
})