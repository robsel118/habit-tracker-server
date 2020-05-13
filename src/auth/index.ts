import jwt from "jsonwebtoken";
import passport from "koa-passport";
import User from "../models/User";

import * as compose from "koa-compose";

import jwtStrategy from "./strategies/jwt";
import emailStrategy from "./strategies/email";
