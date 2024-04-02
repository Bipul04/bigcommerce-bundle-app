// components/BundleForm.js
import React from 'react';
import { useForm } from 'react-hook-form';
import { Box, Button, Form, FormGroup, H1, Input, Panel } from '@bigcommerce/big-design';

interface FormData {
    name: string;
    price: string;
    compared_price: string;
    image: FileList;
}

const BundleForm = () => {
    const { register, handleSubmit, formState: { errors } } = useForm();

    const onSubmit = async (data) => {
        try {
            const productData = {
                name: data.name,
                type: "physical",
                weight: "0lb",
                sale_price: data.price,
                price: data.compared_price,
                // Assuming you're handling the image upload separately
                // image: data.image,
            };
            console.log('productData: ', productData);

            // const response = await fetch('/api/createProduct', {
            //     method: 'POST',
            //     headers: {
            //         'Content-Type': 'application/json',
            //     },
            //     body: JSON.stringify(productData),
            // });

            // if (!response.ok) {
            //     throw new Error('Network response was not ok');
            // }

            // const responseData = await response.json();
            // console.log('Product created successfully:', responseData);
            // Handle success, e.g., show a success message or redirect
        } catch (error) {
            console.error('Error creating product:', error);
            // Handle error, e.g., show an error message
        }
    };

    return (
        <>
            <H1>Bundle Form</H1>
            <Panel>
                <Form onSubmit={handleSubmit(onSubmit)}>
                    <FormGroup>
                        <Input
                            label="Name"
                            name="name"
                            required
                            {...register('name', { required: true })}
                            type='text'
                        />
                        {errors.name && <p>Name is required</p>}
                    </FormGroup>
                    <FormGroup>
                        <Input
                            label="Price"
                            name="price"
                            required
                            {...register('price', { required: true, pattern: /^\d+(\.\d{1,2})?$/ })}
                            type='text'
                        />
                        {errors.price && <p>Price is required and must be a valid number</p>}
                    </FormGroup>
                    <FormGroup>
                        <Input
                            label="Compared price"
                            name="compared_price"
                            required
                            {...register('compared_price', { required: true, pattern: /^\d+(\.\d{1,2})?$/ })}
                            type='text'
                        />
                        {errors.compared_price && <p>Compared price is required and must be a valid number</p>}
                    </FormGroup>
                    <FormGroup>
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
        </>
    );
};

export default BundleForm;
