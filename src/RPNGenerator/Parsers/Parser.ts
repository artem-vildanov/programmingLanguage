import Token from '../../LexicalAnalyzer/Models/Token';
import { TokenType } from '../../LexicalAnalyzer/Enums/TokenType';
import UnexpectedTokenError from "../Errors/UnexpectedTokenError";
import GeneratorStateManager from "../Managers/GeneratorStateManager";
import RpnManager from "../Managers/RpnManager";
import GeneratorState from "../Models/GeneratorState";

export default abstract class Parser {
  rpnManager: RpnManager;
  stateManager: GeneratorStateManager;
  constructor(private generatorState: GeneratorState) {
    this.rpnManager = new RpnManager(generatorState);
    this.stateManager = new GeneratorStateManager(generatorState);
  }

  /**
   * Ассоциативный массив порождающих правил;
   * Ключ - токен (лексема), с которого начинается порождающее правило;
   * Значение - коллбэк, который распарсит входную цепочку
   * согласно соответствующему порождающему правилу;
   */
  protected abstract generationRules: Map<TokenType, CallableFunction>;

  /**
   * Создаем парсер и парсим им порождающие правила. Результат сохраняется в generatorState;
   * @param stateClass класс парсера
   */
  protected parseByParser<T extends Parser>(stateClass: new (generatorState: GeneratorState) => T): void {
    new stateClass(this.generatorState).parse();
  }

  /**
   * Получаем текущий анализируемый токен(терминальный символ).
   * Ищем порождающее правило, которое начинается с этого терминального символа.
   * Вызываем соответствующее правило.
   */
  public parse(): void {
    const token = this.stateManager.getCurrentToken();
    const callable = this.findRuleByToken(token);
    callable();
  }

  /**
   * Ищем порождающее правило по токену (терминалу)
   */
  private findRuleByToken(inputToken: Token): CallableFunction {
    /** Ищем правило перехода */
    const rule = this.generationRules.get(inputToken.type);

    if (rule !== undefined) {
      return rule;
    }

    /** Ищем lambda правило, если не нашли другое правило */
    const lambdaRule = this.generationRules.get(TokenType.default);

    if (lambdaRule !== undefined) {
      return lambdaRule;
    }

    /** Если не нашли подходящих правил перехода выводим ошибку */
    const expectedTokens = Array.from(this.generationRules.keys());
    throw new UnexpectedTokenError(inputToken, ...expectedTokens)
  }
}
