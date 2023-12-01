import {
  FormControl, FormLabel, Input, FormErrorMessage, Wrap, Text, Textarea, Flex, List, ListItem, Button,
  useRadioGroup, NumberInput, NumberInputField, NumberInputStepper, NumberIncrementStepper, NumberDecrementStepper,
  Card, CardBody
} from '@chakra-ui/react';
import RadioCard from './RadioCard';
import { Field, Form, Formik } from 'formik';
import { useState, useEffect } from 'react';
import { getItems } from '../services/items';
import { useAxios } from '../hooks/useAxios';


interface Item {
  /* item: string; */
  name: string;
  amount: string;
  id: number;
}

const CreateRecipe = ({ isMobile }: any) => {
  const [items, setItems] = useState([]);
  const [selected, setSelected] = useState<Item | null>(null);
  const [itemAmount, setItemAmount] = useState('');
  const [itemArray, setItemArray] = useState<Item[]>([]);
  const [image, setImage] = useState(null);

  console.log(isMobile);

  const { post } = useAxios();
  /* console.log(user); */

  const handleImageChange = (event) => {
    if (event.target.files && event.target.files[0]) {
      setImage(event.target.files[0]);
    }
  };

  useEffect(() => {
    const fetchItems = async () => {
      const items = await getItems();
      console.log(items);
      setItems(items);
    };
    fetchItems();
  }, []);

  const itemsWithTitles = items.reduce((acc: any, item: any) => {
    if (!acc.length) {
      return [{ ...item,/* : item.type, */ style: 'title', name: "", isTitle: item.type }, { ...item, style: 'item', isTitle: "" }];
    } else if (acc[acc.length - 1].type === item.type) {
      return [...acc, { ...item, style: 'item', isTitle: "" }];
    } else {
      return [...acc, { ...item, /* item: item.type, */ style: 'title', name: "", isTitle: item.type }, { ...item, style: 'item', isTitle: "" }];
    }
  }, []);

  const handleRadioChange = (e) => {
    console.log(e);
    console.log(items);
    setSelected(items[parseInt(e)]);
  };

  const addItemsToArr = (isFirst: boolean) => {
    console.log(itemAmount);
    if (!selected || itemAmount === '0') {
      return;
    } else if (isFirst) {
      setItemArray([{ name: selected.name, amount: itemAmount, id: selected.id }]);
      setSelected(null);
      setItemAmount('0');
    } else {
      setItemArray([...itemArray, { name: selected.name, amount: itemAmount, id: selected.id }]);
      setSelected(null);
      setItemAmount('0');
    }
  };

  const returnTitle = (title) => {
    return (
      <ListItem key={title}>{title}</ListItem>
    );
  };

  const returnItemArray = () => {
    console.log(itemArray);
    if (!itemArray.length) {
      return (
        <>
          <Text style={{
            backgroundColor: "lime",
            margin: '3px',
            borderRadius: '20px',
            display: 'inline-block',
            padding: '4px'
          }}>{selected ? selected.name : 'pick item'}</Text>
          <Button onClick={() => addItemsToArr(true)}>Add</Button>
        </>
      );
    } else {
      return (
        <>
          <List>
            {itemArray.map((item, id) => {
              return <ListItem
                style={{ backgroundColor: "lime", margin: '3px', borderRadius: '20px', display: 'inline-block', padding: '4px' }}
                key={id}>{item.name} {item.amount}
              </ListItem>;
            })}
          </List>
          <Text>{selected ? selected.name : "pick item"}</Text>
          <Button onClick={() => addItemsToArr(false)}>Add</Button>
        </>
      );
    }
  };

  function validateName(value) {
    let error;
    if (!value) {
      error = 'Name is required';
    }
    return error;
  }

  function validatePassword(value) {
    let error;
    if (!value) {
      error = 'Password is required';
    }
    return error;
  }

  /* const options = ['Option 1', 'Option 2', 'Option 3']; */
  const options = items;

  const { getRootProps, getRadioProps } = useRadioGroup({
    name: 'framework',
    defaultValue: 'react',
    onChange: handleRadioChange,
  });

  const group = getRootProps();

  const handleRecipeSubmit = async (recipe: any) => {
    const newRecipe = {
      name: recipe.name,
      description: recipe.description,
      public: recipe.public,
      imageUri: recipe.imageUri,
      global: recipe.global,
      incredients: itemArray,
    };
    /* const savedRecipe =  *//* await createRecipe(newRecipe); */
    await post('http://localhost:3001/api/recipes', newRecipe, { withCredentials: true });
  };

  if (!isMobile) {
    return (
      <Flex>
        <Card style={{ width: '1260px' }} size='lg'>
          <CardBody>
            <Formik
              initialValues={{ name: '', description: '', public: false }}
              onSubmit={(values, actions) => {
                console.log('submitting on käynnissä');
                const recipe = {
                  name: values.name,
                  description: values.description,
                  public: values.public,
                  global: false,
                  ingredients: itemArray,
                };
                handleRecipeSubmit(recipe);
                actions.setSubmitting(false);
              }}
            >
              {(props) => (
                <Form>
                  <Field name='name' validate={validateName}>
                    {({ field, form }) => (
                      <FormControl isInvalid={form.errors.name && form.touched.name}>
                        <FormLabel>Recipe name</FormLabel>
                        <Input {...field} placeholder='name' />
                        <FormErrorMessage>{form.errors.name}</FormErrorMessage>
                      </FormControl>
                    )}
                  </Field>
                  <Field name='description' validate={validatePassword}>
                    {({ field, form }) => (
                      <FormControl isInvalid={form.errors.description && form.touched.description}>
                        <FormLabel>Recipe description</FormLabel>
                        <Textarea
                          {...field}
                          placeholder='Here is a sample placeholder'
                          size='sm'
                        />
                        <FormErrorMessage>{form.errors.description}</FormErrorMessage>
                      </FormControl>
                    )}
                  </Field>
                  <input type='file' accept='image/*' onChange={handleImageChange} />
                  <label>
                    <Field type='checkbox' name='public' />
                    Make public
                  </label>
                  <Button
                    mt={4}
                    colorScheme='teal'
                    isLoading={props.isSubmitting}
                    type='submit'
                  >
                    Submit
                  </Button>
                  {returnItemArray()}
                  <NumberInput
                    onChange={(valueString) => setItemAmount(valueString)}
                    value={itemAmount}
                  >
                    <NumberInputField />
                    <NumberInputStepper>
                      <NumberIncrementStepper />
                      <NumberDecrementStepper />
                    </NumberInputStepper>
                  </NumberInput>
                </Form>
              )}
            </Formik></CardBody>
        </Card>
        <Wrap {...group}>
          {options.map((value, n) => {
            const radio = getRadioProps({ value: n });

            return (
              <>
                <RadioCard key={n} setSelected={setSelected} {...radio}>
                  {value.name}
                </RadioCard>
              </>
            );
          })}
        </Wrap>
      </Flex>
    );
  } else {
    return (
      <>
        <Card /* style={{ width: '1260px' }} */ size='lg'>
          {/* <CardBody> */}
          <Formik
            initialValues={{ name: '', description: '', public: false }}
            onSubmit={(values, actions) => {
              console.log('submitting on käynnissä');
              const recipe = {
                name: values.name,
                description: values.description,
                public: values.public,
                global: false,
                ingredients: itemArray,
              };
              handleRecipeSubmit(recipe);
              actions.setSubmitting(false);
            }}
          >
            {(props) => (
              <Form>
                <Field name='name' validate={validateName}>
                  {({ field, form }) => (
                    <FormControl isInvalid={form.errors.name && form.touched.name}>
                      <FormLabel>Recipe name</FormLabel>
                      <Input {...field} placeholder='name' />
                      <FormErrorMessage>{form.errors.name}</FormErrorMessage>
                    </FormControl>
                  )}
                </Field>
                <Field name='description' validate={validatePassword}>
                  {({ field, form }) => (
                    <FormControl isInvalid={form.errors.description && form.touched.description}>
                      <FormLabel>Recipe description</FormLabel>
                      <Textarea
                        {...field}
                        placeholder='Here is a sample placeholder'
                        size='sm'
                      />
                      <FormErrorMessage>{form.errors.description}</FormErrorMessage>
                    </FormControl>
                  )}
                </Field>
                <input type='file' accept='image/*' onChange={handleImageChange} />
                <label>
                  <Field type='checkbox' name='public' />
                  Make public
                </label>
                <Button
                  mt={4}
                  colorScheme='teal'
                  isLoading={props.isSubmitting}
                  type='submit'
                >
                  Submit
                </Button>
                {returnItemArray()}
                <NumberInput
                  onChange={(valueString) => setItemAmount(valueString)}
                  value={itemAmount}
                >
                  <NumberInputField />
                  <NumberInputStepper>
                    <NumberIncrementStepper />
                    <NumberDecrementStepper />
                  </NumberInputStepper>
                </NumberInput>
              </Form>
            )}
          </Formik>
        </Card>
        <Wrap {...group}>
          {options.map((value, n) => {
            const radio = getRadioProps({ value: n });

            return (
              <>
                <RadioCard key={n} setSelected={setSelected} {...radio}>
                  {value.name}
                </RadioCard>
              </>
            );
          })}
        </Wrap>
      </>);
  }
};

export default CreateRecipe;