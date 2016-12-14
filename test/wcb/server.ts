import "../utils/utils";

import {Bootstrap} from "./bootstrap";
import injector from "./env/dev";

injector.get(Bootstrap).start();

export default injector;