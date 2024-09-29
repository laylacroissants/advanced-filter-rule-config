export interface Field {
    fieldName: string;
    fieldType: string;
    field: string;
}

export interface  Rule {
    name: string;
    rules: Array<{
        field: Field
        condition: string;
        value: string;
        startValue: string;
        endValue: string;
        operator: string;
        fieldType: string;
    }>;
}