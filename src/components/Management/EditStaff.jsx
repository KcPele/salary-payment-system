import { useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import { useToast, Flex } from "@chakra-ui/react";
import { BsCheckCircleFill } from "react-icons/bs";
import ModalWrapper from "../../common/ModalWrapper";
import avatar from "../../assets/avatar.svg";
import calender from "../../assets/calender.svg";
import { useAuth } from "../API/AuthContext";
import { useFormik } from "formik";
import * as Yup from "yup";
import {
  FormControl,
  FormLabel,
  FormErrorMessage,
  Input,
  Select,
  Box,
  Radio,
  RadioGroup,
} from "@chakra-ui/react";
import { useDisclosure } from "@chakra-ui/react";
import { ChevronDownIcon } from "@chakra-ui/icons";
import Edit from "../../assets/Edit.svg";
import Iicon from "../../assets/Iicon.svg";
import useFetch from "../API/useFetch";


const thumbsContainer = {
  positon: "relative",
  display: "flex",
  flexDirection: "row",
  flexWrap: "wrap",
  marginTop: -10,
  marginLeft: 10,
};

const thumb = {
  display: "inline-flex",
  // borderRadius: 2,
  border: "1px solid #eaeaea",
  marginBottom: 8,
  // marginRight: 8,
  borderRadius: "100%",
  width: 50,
  height: 50,
  // padding: 4,
  boxSizing: "border-box",
};

const thumbInner = {
  display: "flex",
  minWidth: 0,
  overflow: "hidden",
  borderRadius: "100%",
  border: "1px solid #eaeaea",
};

const img = {
  display: "block",
  width: "50px",
  height: "50px",
};

const EditStaff = ({ item }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { setLoading } = useAuth();
  const toast = useToast();
  const [file, setFile] = useState({});
  const { data, pending, error } = useFetch(
    `${process.env.REACT_APP_LORCHAIN_API}/teams`
  );


  const options = { day: "numeric", month: "short", year: "numeric" };
  const currentDate = new Date().toLocaleDateString("en-US", options);

  const dateStr = new Date(currentDate).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  const initialValues = {
    full_name: item.full_name,
    email: item.email,
    natioanlity: item.natioanlity,
    gender: item.gender,
    tax: item.tax_rate,
    salary: item.salary,
    file: {},
    team: item.team,
    state_date: item.state_date,
    job_role: item.job_role,
    address: item.address,
    wallet_address: item.wallet_address,
    phone_number: item.phone_number,
  };

  const formik = useFormik({
    initialValues,
    onSubmit: async (values) => {
      setLoading(true);

      const formData = new FormData();

      formData.append("full_name", values.full_name);
      formData.append("email", values.email);
      formData.append("gender", values.gender);
      formData.append("natioanlity", values.natioanlity);
      formData.append("salary", values.salary);
      formData.append("tax_rate", values.tax);
      formData.append("job_role", values.job_role);
      formData.append("address", values.address);
      formData.append("wallet_address", values.wallet_address);
      formData.append("phone_number", values.phone_number);
      //after changing the file to object not array change if from values.file[0] to values.file
      formData.append("file", values.file);

      let token = localStorage.getItem("lorchaintoken");
      fetch(`${process.env.REACT_APP_LORCHAIN_API}/users/${item._id}`, {
        method: "PUT",
        headers: {
        //   "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      })
        .then((res) => res.json())
        .then((data) => {
          //   setLoading(false);
          toast({
            position: "top-right",
            render: () => (
              <Flex
                color="primary"
                p={3}
                bg="white"
                w="fit-content"
                className="gap-2  items-center font-semibold shadow-card "
                rounded={"md"}
              >
                <BsCheckCircleFill className="text-[#16A34A] " />
                Staff created successfuly
              </Flex>
            ),
          });
          onClose();
          window.location.reload(false);

          //these is where u will handle any logic once it is successful
        })
        .catch((err) => {
          setLoading(false);
          toast({
            position: "top-right",
            render: () => (
              <Flex
                color="white"
                p={3}
                bg="red"
                w="fit-content"
                className="gap-2 items-center font-semibold shadow-card "
                rounded={"md"}
              >
                <BsCheckCircleFill className="text-white " />
                Staff not created
              </Flex>
            ),
          });
          //handle any error here
          console.log(err);
        });
    },
  });

  // /it should be a single file not an array
  const { getRootProps, getInputProps } = useDropzone({
    accept: {
      "image/*": [],
    },
    onDrop: (acceptedFile) => {
      //single file not array
      const file = Object.assign(acceptedFile[0], {
        preview: URL.createObjectURL(acceptedFile[0]),
      });
      setFile(file);
      formik.setFieldValue("file", file);
    },
  });

  const thumbs = file ? (
    <div className="absolute top-3" style={thumb} key={file.name}>
      <div style={thumbInner}>
        <img
          src={file.preview}
          style={img}
          onLoad={() => {
            URL.revokeObjectURL(file.preview);
          }}
          alt=""
        />
      </div>
    </div>
  ) : null;

  useEffect(() => {
    // Make sure to revoke the data uris to avoid memory leaks, will run on unmount
    // return () => file.forEach((file) => URL.revokeObjectURL(file.preview));
  }, []);

  return (
    <div className='w-full'>
      <div onClick={onOpen} className=" w-full flex justify-between">
        <div className="flex gap-2">
          <img src={Edit} alt="" />
          <span>Edit</span>
        </div>
        <img className="" src={Iicon} alt="" />
      </div>
      <ModalWrapper
        isOpen={isOpen}
        size={"4xl"}
        onOpen={onOpen}
        onClose={onClose}
      >
        <form className=" py-6" onSubmit={formik.handleSubmit}>
          <div className="flex justify-between ">
            <p className="font-[500] text-[22px]">Add Staff</p>
            <button
              type="submit"
              className="px-5 py-2 text-white bg-primary h-fit border-2 border-primary rounded-lg"
            >
              Save information
            </button>
          </div>

          <section className="container mt-5 relative">
            <div {...getRootProps({ className: "dropzone" })}>
              <input {...getInputProps()} />

              <div className="flex gap-3 cursor-pointer bg-[#F7F7F7] py-3 pl-4  w-full  rounded-xl">
                <div>
                  <img className="w-[50px]" src={avatar} alt="" />
                </div>
                <div>
                  <p className="font-semibold ">
                    Upload staff picture or drag and drop
                  </p>
                  <p className="text-[14px]">
                    only files in PNG or JPG upto 3MB
                  </p>
                </div>
              </div>
            </div>
            <aside
              className="rounded-full border-2 border-white w-fit h-fit  "
              style={thumbsContainer}
            >
              {thumbs}
            </aside>
          </section>

          <div className="flex items-center mt-10 gap-2 h-[38px] rounded-md font-semibold border-2 border-[#EEEEEE] p-3">
            <img src={calender} alt="" />
            <p>{dateStr}</p>
          </div>
          <div className="flex gap-5 justify-between">
            <div className="w-full tablet:w-[48%]">
              <FormControl
                id="emial"
                mt="5"
                mb={4}
                isInvalid={formik.errors.email && formik.touched.email}
              >
                <FormLabel>Email</FormLabel>
                <Input
                  type="email"
                  placeholder="name@example.com"
                  {...formik.getFieldProps("email")}
                />
                {/* <FormErrorMessage className="absolute -bottom-5">
                  {formik.errors.email}
                </FormErrorMessage> */}
              </FormControl>

              <FormControl
                id="text"
                mt="5"
                mb={4}
                isInvalid={formik.errors.full_name && formik.touched.full_name}
              >
                <FormLabel>Full Name</FormLabel>
                <Input
                  type="text"
                  placeholder="Enter staff name"
                  {...formik.getFieldProps("full_name")}
                />
                <FormErrorMessage className="absolute -bottom-5">
                  {formik.errors.full_name}
                </FormErrorMessage>
              </FormControl>
              <FormControl
                id="phonr_number"
                mt="5"
                mb={4}
                isInvalid={
                  formik.errors.phone_number && formik.touched.phone_number
                }
              >
                <FormLabel>Phone number</FormLabel>
                <Input
                  type="number"
                  placeholder="Enter staff phone no"
                  {...formik.getFieldProps("phone_number")}
                />
                <FormErrorMessage className="absolute -bottom-5">
                  {formik.errors.phone_number}
                </FormErrorMessage>
              </FormControl>
            </div>

            <div className="w-full tablet:w-[48%]">
              <FormControl
                id="gender"
                mt="5"
                isInvalid={formik.errors.gender && formik.touched.gender}
              >
                <FormLabel>Gender</FormLabel>
                <Select
                  placeholder="Gender"
                  fontWeight={"500"}
                  icon={<ChevronDownIcon />}
                  {...formik.getFieldProps("gender")}
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Binary">Binary</option>
                </Select>
                <FormErrorMessage>{formik.errors.gender}</FormErrorMessage>
              </FormControl>
              <FormControl
                id="text"
                mt="5"
                mb={4}
                isInvalid={formik.errors.natioanlity && formik.touched.natioanlity}
              >
                <FormLabel>Nationality</FormLabel>
                <Input
                  type="text"
                  placeholder="Enter your Nation"
                  {...formik.getFieldProps("natioanlity")}
                />
                <FormErrorMessage className="absolute -bottom-5">
                  {formik.errors.natioanlity}
                </FormErrorMessage>
              </FormControl>


              <FormControl
                id="text"
                mt="5"
                mb={4}
                isInvalid={formik.errors.address && formik.touched.address}
              >
                <FormLabel>Address</FormLabel>
                <Input
                  type="text"
                  placeholder="Full address"
                  {...formik.getFieldProps("address")}
                />
                <FormErrorMessage className="absolute -bottom-5">
                  {formik.errors.address}
                </FormErrorMessage>
              </FormControl>
            </div>
          </div>

          <div className="mt-6 ">
            <FormControl
              id="team"
              isInvalid={formik.errors.team && formik.touched.team}
            >
              <FormLabel fontWeight={600} fontSize={"20px"}>
                Staff Name
              </FormLabel>
              <RadioGroup
                {...formik.getFieldProps("team")}
                onChange={(value) => {
                  formik.setFieldValue("team", value);
                }}
              >
                <div className="flex flex-wrap gap-4 justify-between">
                {data?.map((option) => (
                    <Box
                    key={option._id}
                      w={{ base: "40%", md: "30%", lg: "30%" }}
                      className="shadow-md rounded-lg p-4"
                    >
                      <Radio value={option.name}>
                        <p className="text-gray-900 font-[500]">
                          {option.name}
                        </p>
                        <p className="text-[13px] w-fit leading-4 text-gray-700">
                          {option.about}
                        </p>
                      </Radio>
                    </Box>
                  ))}
                </div>
              </RadioGroup>
              <FormErrorMessage>{formik.errors.team}</FormErrorMessage>
            </FormControl>
          </div>
          <div className="flex gap-5 justify-between">
            <div className="w-full tablet:w-[48%]">
            <FormControl
                id="Product Designer"
                mt="5"
                mb={4}
                isInvalid={
                  formik.errors.job_role && formik.touched.job_role
                }
              >
                <FormLabel>Role</FormLabel>
                <Input
                  type="text"
                  placeholder="Enter job role"
                  {...formik.getFieldProps("job_role")}
                />
                <FormErrorMessage className="absolute -bottom-5">
                  {formik.errors.job_role}
                </FormErrorMessage>
              </FormControl>
              {/* <FormControl
                id="job_role"
                mt="5"
                isInvalid={formik.errors.job_role && formik.touched.job_role}
              >
                <FormLabel>Role</FormLabel>
                <Select
                  placeholder="Product Designer"
                  fontWeight={"500"}
                  icon={<ChevronDownIcon />}
                  {...formik.getFieldProps("job_role")}
                >
                  <option value="frontend">Frontend</option>
                  <option value="backend">Backend</option>
                  <option value="devops">DevOps</option>
                  <option value="management">Management</option>
                </Select>
                <FormErrorMessage>{formik.errors.job_role}</FormErrorMessage>
              </FormControl> */}

              <FormControl
                id="job_role"
                mt="5"
                mb={4}
                isInvalid={
                  formik.errors.wallet_address && formik.touched.wallet_address
                }
              >
                <FormLabel>Wallet Address</FormLabel>
                <Input
                  type="text"
                  placeholder="0xC5..."
                  {...formik.getFieldProps("wallet_address")}
                />
                <FormErrorMessage className="absolute -bottom-5">
                  {formik.errors.wallet_address}
                </FormErrorMessage>
              </FormControl>
            </div>
            <div className="w-full tablet:w-[48%]">
              <FormControl
                id="salary"
                mt="5"
                mb={4}
                pos={"relative"}
                isInvalid={formik.errors.salary && formik.touched.salary}
              >
                <FormLabel>Salary</FormLabel>
                <Input
                  type="number"
                  pl="6"
                  placeholder="000"
                  {...formik.getFieldProps("salary")}
                />
                <span className="font-bold absolute top-10 left-3">$</span>
                <FormErrorMessage className="absolute -bottom-5">
                  {formik.errors.salary}
                </FormErrorMessage>
              </FormControl>

              <FormControl
                id="tax"
                mt="5"
                mb={4}
                pos={"relative"}
                isInvalid={formik.errors.tax && formik.touched.tax}
              >
                <FormLabel>Tax rate</FormLabel>
                <Input
                  type="number"
                  pl="7"
                  placeholder="00"
                  {...formik.getFieldProps("tax")}
                />
                <span className="font-bold absolute top-10 left-3">%</span>
                <FormErrorMessage className="absolute -bottom-5">
                  {formik.errors.tax}
                </FormErrorMessage>
              </FormControl>
            </div>
          </div>
          <br />
        </form>
      </ModalWrapper>
    </div>
  );
};

export default EditStaff;
