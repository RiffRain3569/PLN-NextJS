import { Children, ReactElement, cloneElement } from 'react';
import { Column } from './view/Column';
import { Row } from './view/Row';

export function V({ children }: { children: ReactElement }) {
    const child = Children.only(children);

    return cloneElement(child);
}

V.Column = Column;
V.Row = Row;
