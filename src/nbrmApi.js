export const getExchangeRate = (startDate, endDate) => {
    const data =
      '<?xml version="1.0" encoding="utf-8"?> <soap12:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap12="http://www.w3.org/2003/05/soap-envelope"> <soap12:Body> <GetExchangeRate xmlns="http://www.nbrm.mk/klservice/"> <StartDate>' +
      startDate +
      "</StartDate> <EndDate>" +
      endDate +
      "</EndDate> </GetExchangeRate> </soap12:Body> </soap12:Envelope>";
    return fetch(
      "https://cors-anywhere.herokuapp.com/http://www.nbrm.mk/klservice/kurs.asmx",
      {
        method: "post",
        headers: {
          "Content-Type": "application/soap+xml; charset=utf-8"
        },
        body: data
      }
    )
      .then(response => response.text())
      // eslint-disable-next-line no-console
      .catch(error => console.warn(error));
  };