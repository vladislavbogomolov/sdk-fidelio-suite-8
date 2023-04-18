import {Fidelio} from "./Fidelio";
import {FidelioRequest} from "./requests/FidelioRequest";

export {Fidelio}

const connectionPA = new Fidelio({
    URL: "https://s8bal.hcd.cloud/PATEST/fidelioIISWrapper.dll/FidelioXMLInterface.DataHandler?ic=PATEST",
    CODE: "PATEST",
    FIDELIO_VERSION: "1.1.0",
    FIDELIO_VENDOR: "sdk-fidelio-suite",
    FIDELIO_USERNAME: "",
    FIDELIO_PASSWORD: "",
    USER_AGENT: "FidelioNodeService",
    DEBUG_ENABLED: false,
    IS_MASTER: true
});

/*
async function test() {
    // const x = await connectionPA.ChildrenCategories.get();
    // console.log(x.toJSON())

    // const result = await new CustomQuery().where('XCMS_NAME3', 'Rik').get('XCMS', ['XCMS_NAME3'])
    // console.log(result)
    // const profile = await new Profile().find(545225);
    // console.log(profile.data)

    const connectionPA = new Fidelio({
        URL: "https://s8bal.hcd.cloud/PATEST/fidelioIISWrapper.dll/FidelioXMLInterface.DataHandler?ic=PATEST",
        CODE: "PATEST",
        FIDELIO_VERSION: "1.1.0",
        FIDELIO_VENDOR: "sdk-fidelio-suite",
        FIDELIO_USERNAME: "",
        FIDELIO_PASSWORD: "",
        USER_AGENT: "FidelioNodeService",
        DEBUG_ENABLED: false,
        IS_MASTER: true
    });
    const x = await connectionPA.AvailabilityForWeb.get({
        GuestArrival: new Date('2023-06-01'),
        GuestDeparture: new Date('2023-06-05'),
        NoOfAdults: 1
    })

    console.log(x)
    const connectionB = new FidelioRequest();
}
test()*/