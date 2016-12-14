import {Injector} from "edi/injector";
import {QuickbaseService} from "../services/quickbase/service";
import {RealQuickbaseService} from "../services/quickbase/real";

const injector = new Injector();
injector.bind(QuickbaseService.class,RealQuickbaseService.class);

export default injector;