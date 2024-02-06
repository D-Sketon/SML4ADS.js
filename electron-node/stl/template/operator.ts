export type MultiDimensionalArray<T> = Array<T | MultiDimensionalArray<T>>;

export interface Operator {
  name: string;
}

export interface FutureOperator extends Operator {
  from: string;
  to: string;
  not: boolean;
}

export interface BinaryOperator extends Operator {
  left: Operator;
  right: Operator;
}

export interface UnaryOperator extends Operator {
  children: Operator;
}

export class GloballyOperator implements FutureOperator, UnaryOperator {
  name = "always";
  from: string;
  to: string;
  not = false;
  children: Operator;
  constructor(not = false) {
    this.not = not;
  }
}

export class FinallyOperator implements FutureOperator, UnaryOperator {
  name = "eventually";
  from: string;
  to: string;
  not = false;
  children: Operator;
  constructor(not = false) {
    this.not = not;
  }
}

export class UntilOperator implements FutureOperator, BinaryOperator {
  name = "until";
  left: Operator;
  right: Operator;
  from: string;
  to: string;
  not = false;
  constructor(not = false) {
    this.not = not;
  }
}

export class AndOperator implements BinaryOperator {
  name = "and";
  left: Operator;
  right: Operator;
}

export class OrOperator implements BinaryOperator {
  name = "or";
  left: Operator;
  right: Operator;
}

export class ImplyOperator implements BinaryOperator {
  name = "->";
  left: Operator;
  right: Operator;
  not = false;
  constructor(not = false) {
    this.not = not;
  }
}

export class ThenOperator {
  name = "then";
}

export class NotOperator implements UnaryOperator {
  name = "not";
  children: Operator;
}

export class Atom implements Operator {
  name: string;
  constructor(name: string) {
    this.name = name;
  }
}

export class Comment implements Operator{
  name = "comment";
  children: string;

  constructor(comment: string) {
    this.children = comment;
  }
}