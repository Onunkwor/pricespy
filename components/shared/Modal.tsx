"use client";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { addUserEmailToProduct } from "@/lib/actions";
import Image from "next/image";
import { FormEvent, useState } from "react";
interface Props {
  productId: string;
}
function Modal({ productId }: Props) {
  const [inputValue, setInputValue] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    // console.log(inputValue);

    await addUserEmailToProduct(productId, inputValue);
    setIsSubmitting(false);
    setInputValue("");
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <button className="btn">Track</button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] bg-white ">
        <DialogHeader>
          <DialogTitle>
            <Image
              src="/assets/icons/logo.svg"
              width={30}
              height={30}
              alt="logo"
            />
          </DialogTitle>
          <DialogDescription className="flex flex-col items-start text-left leading-8">
            <p className="dialog-head_text">
              {" "}
              Stay updated with product pricing alerts right in your inbox!
            </p>
            <p className="text-sm text-gray-600">
              Never miss a bargain again with our timely alerts!
            </p>
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="">
            <Label htmlFor="email">Email address</Label>
            <div className="flex border border-[#ccc] rounded-full px-5 mt-5">
              <Image
                src="/assets/icons/mail.svg"
                alt="mail"
                width={24}
                height={24}
              />
              <Input
                id="name"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                className="input-field "
                placeholder="Jon@gmail.com"
              />
            </div>
          </div>
          <DialogFooter>
            <button type="submit" className="btn w-full my-4">
              {isSubmitting ? "Submitting..." : "Track Product"}
            </button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default Modal;
