"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
Object.assign(global, { WebSocket: require('ws') });
const rxjs_1 = require("rxjs");
const motion_master_client_1 = require("motion-master-client");
const client = (0, motion_master_client_1.createMotionMasterClient)('192.168.1.112');
client.reqResSocket.opened$.pipe((0, rxjs_1.first)(Boolean)).subscribe(() => __awaiter(void 0, void 0, void 0, function* () {
    const message = yield (0, rxjs_1.firstValueFrom)(client.request.getSystemVersion(1000));
    console.log(`System version is ${message === null || message === void 0 ? void 0 : message.version}`);
    client.closeSockets();
}));
