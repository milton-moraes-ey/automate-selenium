const { Builder, By, Key } = require("selenium-webdriver");
const fs = require("fs");
const csv = require("csv-parser");
const path = require("path");
const csvPath = path.resolve("MissingCustomers.csv");
const csvData = [];

const driver = new Builder().forBrowser("chrome").build();
const getElement = (id) => driver.findElement(By.id(id));

const initializeBrowser = async () => {
  await driver.get(
    "https://developer.automationanywhere.com/challenges/automationanywherelabs-customeronboarding.html"
  );
};

const closeBrowser = async () => {
  await driver.quit();
};

initializeBrowser();

const customerName = getElement("customerName");
const customerID = getElement("customerID");
const primaryContact = getElement("primaryContact");
const streetAddress = getElement("street");
const city = getElement("city");
const state = getElement("state");
const zip = getElement("zip");
const email = getElement("email");
const offerDiscountsYES = getElement("activeDiscountYes");
const offerDiscountsNO = getElement("activeDiscountNo");
const nonDisclosureOnFile = getElement("NDA");
const registerButton = getElement("submit_button");

const automateForm = async (values) => {
  for (let i = 0; i < values.length; i++) {
    await customerName.sendKeys(values[i].customerName, Key.RETURN);

    await customerID.sendKeys(values[i].customerID, Key.RETURN);

    await primaryContact.sendKeys(values[i].primaryContact, Key.RETURN);

    await streetAddress.sendKeys(values[i].streetAddress, Key.RETURN);

    await city.sendKeys(values[i].city, Key.RETURN);

    await state.sendKeys(values[i].state, Key.RETURN);

    await zip.sendKeys(values[i].zip, Key.RETURN);

    await email.sendKeys(values[i].email, Key.RETURN);

    values[i].offerDiscounts == "YES"
      ? await offerDiscountsYES.click()
      : await offerDiscountsNO.click();

    if (values[i].nonDisclosureOnFile == "YES")
      await nonDisclosureOnFile.click();

    await registerButton.click();
  }
};

fs.createReadStream(csvPath)
  .pipe(csv())
  .on("data", (row) => {
    const dataItem = {
      customerName: row["Company Name"],
      customerID: row["Customer ID"],
      primaryContact: row["Primary Contact"],
      streetAddress: row["Street Address"],
      city: row["City"],
      state: row["State"],
      zip: row["Zip"],
      email: row["Email Address"],
      offerDiscounts: row["Offers Discounts"],
      nonDisclosureOnFile: row["Non-Disclosure On File"],
    };
    csvData.push(dataItem);
  })
  .on("end", () => {
    console.table(csvData);
    automateForm(csvData);
  });