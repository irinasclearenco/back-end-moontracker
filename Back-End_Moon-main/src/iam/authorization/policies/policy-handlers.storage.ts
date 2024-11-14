import { PolicyHandler } from './interfaces/policy-handler';
import { Injectable, Type } from '@nestjs/common';
import { Policy } from './interfaces/policy.interface';
@Injectable()
export class PolicyHandlersStorage {
  private readonly collection = new Map<Type<Policy>, PolicyHandler<any>>();
  public add<T extends Policy>(policyCls: Type<T>, handler: PolicyHandler<T>) {
    this.collection.set(policyCls, handler);
  }

  public get<T extends Policy>(
    policyCls: Type<T>,
  ): PolicyHandler<T> | undefined {
    const handler = this.collection.get(policyCls);
    if (!handler) {
      throw new Error(
        ` ${policyCls.name} does not have the associated handler`,
      );
    }
    return handler;
  }
}
