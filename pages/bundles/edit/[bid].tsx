// components/BundleForm.js
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Box, Button, FileUploader, Form, FormGroup, Input, Panel, } from '@bigcommerce/big-design';
import { useSession } from 'context/session';
import router from 'next/router';

const editBundle = () => {
    const encodedContext = useSession()?.context;
    const { register, handleSubmit, formState: { errors } } = useForm();
    const [files, setFiles] = useState<File[]>([]);

    const onSubmit = async (data: BundleFormData) => {
        try {
            const reader = new FileReader();
            reader.readAsDataURL(files[0]);
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



    const validateFileSize = (file: File) => {
        const MB = 1024 * 1024;

        return file.size <= MB;
    };

    return (
        <Panel header="Edit bundle"
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

                    <FileUploader
                        dropzoneConfig={{
                            label: 'Drag and drop image here',
                        }}
                        files={files}
                        label="Upload files"
                        onFilesChange={setFiles}
                        required
                        validators={[
                            {
                                validator: validateFileSize,
                                type: 'file-size',
                            },
                        ]}
                    />
                </FormGroup>

                <Box marginTop="xxLarge">
                    <Button type="submit">Submit</Button>
                </Box>
            </Form>
        </Panel>
    );
};

export default editBundle;
