import RPNItem from "../../RPNGenerator/Models/RPNItem";

interface IHandler {
    handle(rpnItem: RPNItem): void;
}

export default IHandler;