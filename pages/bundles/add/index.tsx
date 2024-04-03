// components/BundleForm.js
import React from 'react';
import { useForm } from 'react-hook-form';
import { Box, Button, Form, FormGroup, Input, Panel, } from '@bigcommerce/big-design';
import { useSession } from 'context/session';
import router from 'next/router';

interface FormData {
    name: string;
    price: string;
    compared_price: string;
    image: FileList;
}

const BundleForm = () => {
    const encodedContext = useSession()?.context;
    const { register, handleSubmit, formState: { errors } } = useForm();

    const onSubmit = async (data) => {
        try {
            const reader = new FileReader();
            reader.readAsDataURL(data.image[0]);
            reader.onloadend = async () => {
                const base64Image = reader.result;

                const productData = {
                    name: data.name,
                    type: "physical",
                    weight: "0.0",
                    sale_price: data.price,
                    price: data.compared_price,
                    image: base64Image,
                };

                const response = await fetch(`/api/bundles/createProduct?context=${encodedContext}`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(productData),
                });

                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const responseData = await response.json();
                console.log('Product created successfully:', responseData);
                router.push('/bundles');
            };

        } catch (error) {
            console.error('Error creating product:', error);
        }
    };

    return (
        <Panel header="Add bundle"
        >
            <Form onSubmit={handleSubmit(onSubmit)}>
                <FormGroup>
                    <Input
                        label="Name"
                        name="name"
                        required
                        {...register('name', { required: true })}
                        type='text'
                        placeholder='Name'
                    />
                    {errors.name && <p>Name is required</p>}
              
                    <Input
                        label="Price"
                        name="price"
                        required
                        {...register('price', { required: true, pattern: /^\d+(\.\d{1,2})?$/ })}
                        type='text'
                        placeholder='Price'
                    />
                    {errors.price && <p>Price is required and must be a valid number</p>}
                    <Input
                        label="Compared price"
                        name="compared_price"
                        required
                        {...register('compared_price', { required: true, pattern: /^\d+(\.\d{1,2})?$/ })}
                        type='text'
                        placeholder='Compared price'
                    />
                    {errors.compared_price && <p>Compared price is required and must be a valid number</p>}
            
                    <Input
                        label="Image"
                        name="image"
                        required
                        type='file'
                        {...register('image', { required: true })}
                    />

                    {errors.image && <p>Image is required</p>}
                </FormGroup>

                <Box marginTop="xxLarge">
                    <Button type="submit">Submit</Button>
                </Box>
            </Form>
        </Panel>
    );
};

export default BundleForm;
