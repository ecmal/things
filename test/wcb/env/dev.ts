import {Injector} from "edi/injector";
import {QuickbaseService} from "../services/quickbase/service";
//import {FakeQuickbaseService} from "../services/quickbase/fake";
import {RealQuickbaseService} from "../services/quickbase/real";

const injector = new Injector();
//injector.bind(QuickbaseService.class,FakeQuickbaseService.class);
injector.bind(QuickbaseService.class,RealQuickbaseService.class);

export default injector;