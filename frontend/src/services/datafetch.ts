export interface dataItem {
    id : string
    name : string
    joinDate : string
}

export interface filterItem {
    column : string
    operation : string
    reference : string | number
}

export async function fetchUserData(count : number, page : number, sortBy? : string, invert? : boolean, filter? : filterItem[]) : Promise<dataItem[]> {
    // sort by string
    // filter for every filter item
    // get from (page * count to (page + 1) * count)
    return []
}

export async function fetchUserPages(count : number, filter? : filterItem[]){
    // sort by string
    // filter for every filter item
    // get from (page * count to (page + 1) * count)
}

export async function dummyFetchUserData(count : number, page : number, sortBy? : string, invert? : boolean, filter? : filterItem[]) : Promise<dataItem[]> {

    return dummy.slice(page*count, Math.min((page+1) * count,dummy.length-1))
}

export function dummyFetchUserPages(count : number, filter? : filterItem[]){

    return Math.ceil(dummy.length/count)

}

export default {fetchUserData}

const dummy: dataItem[] = [
    { id: "100", name: "Samuel", joinDate: "2022-01-15" },
    { id: "101", name: "Jackson", joinDate: "2021-11-22" },
    { id: "102", name: "Emma", joinDate: "2023-03-10" },
    { id: "103", name: "Liam", joinDate: "2020-06-18" },
    { id: "104", name: "Olivia", joinDate: "2019-12-05" },
    { id: "105", name: "Noah", joinDate: "2021-08-30" },
    { id: "106", name: "Ava", joinDate: "2020-07-14" },
    { id: "107", name: "Sophia", joinDate: "2018-09-21" },
    { id: "108", name: "William", joinDate: "2023-02-17" },
    { id: "109", name: "James", joinDate: "2022-05-25" },
    { id: "110", name: "Benjamin", joinDate: "2019-11-12" },
    { id: "111", name: "Lucas", joinDate: "2020-01-30" },
    { id: "112", name: "Mia", joinDate: "2021-03-07" },
    { id: "113", name: "Ethan", joinDate: "2022-06-19" },
    { id: "114", name: "Charlotte", joinDate: "2019-08-22" },
    { id: "115", name: "Alexander", joinDate: "2023-04-13" },
    { id: "116", name: "Amelia", joinDate: "2021-07-01" },
    { id: "117", name: "Henry", joinDate: "2018-11-10" },
    { id: "118", name: "Ella", joinDate: "2022-09-15" },
    { id: "119", name: "Sebastian", joinDate: "2020-02-28" },
    { id: "120", name: "Harper", joinDate: "2023-05-19" },
    { id: "121", name: "Daniel", joinDate: "2019-10-03" },
    { id: "122", name: "Luna", joinDate: "2021-12-09" },
    { id: "123", name: "Matthew", joinDate: "2020-05-15" },
    { id: "124", name: "Scarlett", joinDate: "2018-07-07" },
    { id: "125", name: "David", joinDate: "2022-10-26" },
    { id: "126", name: "Aiden", joinDate: "2019-04-20" },
    { id: "127", name: "Ella", joinDate: "2021-06-12" },
    { id: "128", name: "Samuel", joinDate: "2023-07-31" },
    { id: "129", name: "Chloe", joinDate: "2018-08-09" },
    { id: "130", name: "Jack", joinDate: "2022-11-23" },
    { id: "131", name: "Zoe", joinDate: "2020-03-29" },
    { id: "132", name: "Nathan", joinDate: "2019-12-18" },
    { id: "133", name: "Madison", joinDate: "2023-01-27" },
    { id: "134", name: "Leo", joinDate: "2021-02-17" },
    { id: "135", name: "Grace", joinDate: "2018-06-05" },
    { id: "136", name: "Gabriel", joinDate: "2020-09-14" },
    { id: "137", name: "Hannah", joinDate: "2019-03-11" },
    { id: "138", name: "Isaac", joinDate: "2022-08-28" },
    { id: "139", name: "Lily", joinDate: "2020-04-22" },
    { id: "140", name: "Anthony", joinDate: "2021-09-07" },
    { id: "141", name: "Addison", joinDate: "2023-06-11" },
    { id: "142", name: "Eleanor", joinDate: "2018-10-19" },
    { id: "143", name: "Dylan", joinDate: "2022-02-09" },
    { id: "144", name: "Aria", joinDate: "2019-05-04" },
    { id: "145", name: "Ryan", joinDate: "2020-07-16" },
    { id: "146", name: "Layla", joinDate: "2021-11-30" },
    { id: "147", name: "Caleb", joinDate: "2018-12-03" },
    { id: "148", name: "Penelope", joinDate: "2023-08-22" },
    { id: "149", name: "Ezra", joinDate: "2021-01-06" },
    { id: "150", name: "Mason", joinDate: "2019-07-17" },
    { id: "151", name: "Nova", joinDate: "2020-10-14" },
    { id: "152", name: "Julian", joinDate: "2018-03-25" },
    { id: "153", name: "Bella", joinDate: "2022-12-29" },
    { id: "154", name: "Levi", joinDate: "2023-09-10" },
    { id: "155", name: "Aurora", joinDate: "2019-06-01" },
    { id: "156", name: "Eli", joinDate: "2020-11-08" },
    { id: "157", name: "Stella", joinDate: "2021-04-14" },
    { id: "158", name: "Lincoln", joinDate: "2018-05-23" },
    { id: "159", name: "Violet", joinDate: "2023-10-09" },
    { id: "160", name: "Theodore", joinDate: "2019-09-15" },
    { id: "161", name: "Hazel", joinDate: "2020-02-05" },
    { id: "162", name: "Elijah", joinDate: "2021-08-29" },
    { id: "163", name: "Alice", joinDate: "2022-07-04" },
    { id: "164", name: "Andrew", joinDate: "2018-02-18" },
    { id: "165", name: "Lillian", joinDate: "2023-11-26" },
    { id: "166", name: "Hudson", joinDate: "2020-06-07" },
    { id: "167", name: "Claire", joinDate: "2021-10-19" },
    { id: "168", name: "Jonathan", joinDate: "2019-01-09" },
    { id: "169", name: "Victoria", joinDate: "2022-03-15" },
    { id: "170", name: "Charlie", joinDate: "2018-04-30" },
    { id: "171", name: "Everly", joinDate: "2023-12-05" },
    { id: "172", name: "Adam", joinDate: "2020-08-11" },
  ];