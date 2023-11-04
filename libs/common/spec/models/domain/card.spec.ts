import { CardData } from "@bitwarden/common/models/data/card.data";
import { Card } from "@bitwarden/common/models/domain/card";
import { EncString } from "@bitwarden/common/models/domain/enc-string";

import { mockEnc, mockFromJson } from "../../utils";

describe("Card", () => {
  let data: CardData;

  beforeEach(() => {
    data = {
      cardholderName: "encHolder",
      brand: "encBrand",
      number: "encNumber",
      expMonth: "encMonth",
      expYear: "encYear",
      code: "encCode",
    };
  });

  it("Convert from empty", () => {
    const data = new CardData();
    const card = new Card(data);

    expect(card).toEqual({
      cardholderName: null,
      brand: null,
      number: null,
      expMonth: null,
      expYear: null,
      code: null,
    });
  });

  it("Convert", () => {
    const card = new Card(data);

    expect(card).toEqual({
      cardholderName: { encryptedString: "encHolder", encryptionType: 0 },
      brand: { encryptedString: "encBrand", encryptionType: 0 },
      number: { encryptedString: "encNumber", encryptionType: 0 },
      expMonth: { encryptedString: "encMonth", encryptionType: 0 },
      expYear: { encryptedString: "encYear", encryptionType: 0 },
      code: { encryptedString: "encCode", encryptionType: 0 },
    });
  });

  it("toCardData", () => {
    const card = new Card(data);
    expect(card.toCardData()).toEqual(data);
  });

  it("Decrypt", async () => {
    const card = new Card();
    card.cardholderName = mockEnc("cardHolder");
    card.brand = mockEnc("brand");
    card.number = mockEnc("number");
    card.expMonth = mockEnc("expMonth");
    card.expYear = mockEnc("expYear");
    card.code = mockEnc("code");

    const view = await card.decrypt(null);

    expect(view).toEqual({
      _brand: "brand",
      _number: "number",
      _subTitle: null,
      cardholderName: "cardHolder",
      code: "code",
      expMonth: "expMonth",
      expYear: "expYear",
    });
  });

  describe("fromJSON", () => {
    it("initializes nested objects", () => {
      jest.spyOn(EncString, "fromJSON").mockImplementation(mockFromJson);

      const actual = Card.fromJSON({
        cardholderName: "mockCardHolder",
        brand: "mockBrand",
        number: "mockNumber",
        expMonth: "mockExpMonth",
        expYear: "mockExpYear",
        code: "mockCode",
      });

      expect(actual).toEqual({
        cardholderName: "mockCardHolder_fromJSON",
        brand: "mockBrand_fromJSON",
        number: "mockNumber_fromJSON",
        expMonth: "mockExpMonth_fromJSON",
        expYear: "mockExpYear_fromJSON",
        code: "mockCode_fromJSON",
      });
      expect(actual).toBeInstanceOf(Card);
    });

    it("returns null if object is null", () => {
      expect(Card.fromJSON(null)).toBeNull();
    });
  });
});
