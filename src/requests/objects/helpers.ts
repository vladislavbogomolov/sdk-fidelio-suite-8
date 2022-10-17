export const XMLElementList = ["Child", "PersonalDocument", "Notes", "Addresses", "Street1", "Street2", "Street3", "City", "State", "CountryISO2", "CustomField"];
export const XMLElementComplex = ["Child", "PersonalDocument", "GuestDeparture"];

export const isElementList = (element: string) => {
  return XMLElementList.includes(element)
}

export const isElementComplex = (element: string) => {
  return XMLElementComplex.includes(element)
}
