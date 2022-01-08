export const Messages = {
    "elementDoesntExist": "The elemente doesen't exist in the database",
    "elementExist": "The element exist in the database",
    "fieldCantBeNull": (varName: string) => `The field ${varName} can't be null`,
    "fieldsExist": (varName:string[])=> {
        let name = "";
        for (const iterator of varName) {
            if(name !== ""){
                name += ` or ${iterator}`
            }
            else {
                name = iterator
            }
        }
        return `The ${name} already exist in database`
    }
}
