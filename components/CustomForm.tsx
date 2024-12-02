import { CustomProps } from '@/interface'
// import React from 'react'
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import Image from 'next/image';
import { Textarea } from './ui/textarea';
import { Checkbox } from './ui/checkbox';
import { Select, SelectContent, SelectTrigger, SelectValue } from './ui/select';
import 'react-phone-number-input/style.css'
import PhoneInput from 'react-phone-number-input'
import { E164Number } from "libphonenumber-js/core";

export enum FormFieldEnum {
    INPUT = "input",
    TEXTAREA = "textarea",
    PHONE_INPUT = "phoneInput",
    CHECKBOX = "checkbox",
    DATE_PICKER = "dataPicker",
    SELECT = "select",
    SKELETON = "skeleton",
}



const CustomForm = (props: CustomProps) => {
    const { control, name, label } = props;
    return (
        <FormField
            control={control}
            name={name}
            render={({ field }) => (
                <FormItem className="flex-1">
                    {props.fieldType !== FormFieldEnum.CHECKBOX && label && (

                        <FormLabel className='shad-input-label'>{label}</FormLabel>
                    )}

                    <RenderInput field={field} props={props} />
                    <FormMessage className='shad-error' />
                </FormItem>
            )}
        />
    )
}

export default CustomForm;

const RenderInput = ({ field, props }: { field: any; props: CustomProps }) => {
    switch (props.fieldType) {
        case FormFieldEnum.INPUT:
            return (
                <div className='flex rounded-md border border-dark-500 bg-dark-400'>
                    {props.iconSrc && (
                        <Image
                            src={props.iconSrc}
                            alt={props.iconAlt || "icon"}
                            height={24}
                            width={24}
                            className='ml-2'
                        />
                    )}

                    <FormControl>
                        <Input placeholder={props.placeholder}
                            {...field}
                            className='shad-input border-0' />
                    </FormControl>
                </div>
            );

        case FormFieldEnum.TEXTAREA:
            return (
                <FormControl>
                    <Textarea placeholder={props.placeholder}
                        {...field}
                        className="shad-textArea"
                        disabled={props.disabled} />
                </FormControl>
            );

        case FormFieldEnum.CHECKBOX:
            return (
                <FormControl>
                    <div className='flex items-center gap-4'>
                        <Checkbox id={props.name}
                            checked={field.value}
                            onCheckedChange={field.onChange}
                        />

                        <label htmlFor={props.name} className='checkbox-label'>
                            {props.label}
                        </label>
                    </div>
                </FormControl>
            );

        case FormFieldEnum.DATE_PICKER:
            return (
                <div className='flex rounded-md border border-dark-500 bg-dark-400'>
                    <Image
                        src="/assets/icons/calendar.svg"
                        height={24}
                        width={24}
                        alt="user"
                        className="ml-2"
                    />

                    <FormControl>
                        {/* TODO */}
                    </FormControl>

                </div>
            );


        case FormFieldEnum.PHONE_INPUT:
            return (
                <FormControl>
                    <PhoneInput
                    defaultCountry='EG'
                        placeholder={props.placeholder}
                        international
                        withCountryCallingCode
                        value={field.value as E164Number | undefined}
                        onChange={field.onChange} 
                        className='input-phone'
                        />
                </FormControl>
            );


        case FormFieldEnum.SELECT:
            return (
                <FormControl>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                            <SelectTrigger className='shad-select-trigger'>
                                <SelectValue placeholder={props.placeholder} />
                            </SelectTrigger>
                        </FormControl>
                        <SelectContent className='shad-select-content'>
                            {props.children}
                        </SelectContent>
                    </Select>
                </FormControl>
            );

        case FormFieldEnum.SKELETON:
            return props.renderSkeleton ? props.renderSkeleton(field) : null;
        default:
            return null;
    }
}
