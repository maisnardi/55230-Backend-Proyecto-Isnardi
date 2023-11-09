import { Router } from "express";

export default class CustomRouter {
  constructor() {
    this.router = Router();
    this.init();
  }
  init() { }
  getRouter = () => this.router;
  applyCbs = (cbs) => {
    return cbs.map((cb) => async (...params) => {
      try {
        await cb.apply(this, params);
      } catch (error) {
        return params[1].status(500).send(error);
      }
    });
  };
  create = (path, ...cbs) => this.router.post(path, this.applyCbs(cbs));
  read = (path, ...cbs) => this.router.get(path, this.applyCbs(cbs));
  update = (path, ...cbs) => this.router.put(path, this.applyCbs(cbs));
  destroy = (path, ...cbs) => this.router.delete(path, this.applyCbs(cbs));
  use = (path, ...cbs) => this.router.use(path, this.applyCbs(cbs));
}