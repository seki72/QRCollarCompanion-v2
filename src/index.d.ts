type Pet = {
  uuid: string;
  pet_image: string;
  pet_type: string;
  breed: string;
  name: string;
  age: number | string;
  owner?: Owner;
};

type Owner = {
  uuid?: string;
  address: string;
  contact_number: string;
  name: string;
  email: string;
  gender: string;
  age: number;
  image: string;
};
