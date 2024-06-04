import Token from '../../LexicalAnalyzer/Models/Token'
import RPNItemTypes from "../Enums/RPNItemTypes"

type RPNItem = {
  itemType: RPNItemTypes,
  value: string | number,
  token: null | Token
}

export default RPNItem
