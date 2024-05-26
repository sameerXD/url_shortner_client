"use client";
import React, { forwardRef, useEffect, useState } from "react";
import { IoAddCircleOutline } from "react-icons/io5";
import {
  IUrl,
  IUser,
  base_url,
  deleteHash,
  getAllUrls,
  shortenUrl,
} from "../utils/userApi";
import { MdEdit } from "react-icons/md";
import { MdDelete } from "react-icons/md";

const Table = forwardRef<
  HTMLDivElement,
  {
    user: IUser | undefined;
    token: string;
  }
>((props, ref) => {
  const [newRow, setNewRow] = useState({
    originalUrl: "",
    maxUses: 0,
  });

  const [showNewRow, setShowNewRow] = useState(false);

  const [loading, setLoading] = useState(false);

  const [allUrls, setAllUrls] = useState<IUrl[]>([]);
  useEffect(() => {
    if (props.token) {
      getAllUrls(props.token)
        .then((data) => {
          setAllUrls(data);
        })
        .catch((e) => {
          console.log("error in fetching all urls");
        });
    }
  }, [props.token]);

  const [openEdit, setOpenEdit] = useState({
    productId: "",
    open: false,
    product: {
      _id: "",
      originalUrl: "",
      hash: "",
      clicks: 0,
      maxUses: 0,
      remainingUses: 0,
    },
  });
  const handlePostUrl = async () => {
    try {
      setLoading(true);
      await shortenUrl(
        {
          maxUses: newRow.maxUses,
          originalUrl: newRow.originalUrl,
        },
        props.token
      );

      const getAllUrlsData = await getAllUrls(props.token);
      setAllUrls(getAllUrlsData);
      setShowNewRow(!showNewRow);
      setLoading(false);
    } catch (err) {
      setLoading(false);

      console.log(err);
    }
  };

  const handleDelete = async (hash: string) => {
    try {
      setLoading(true);
      if (!props.user) return;
      await deleteHash(
        {
          hash,
        },
        props.token
      );

      const getAllUrlsData = await getAllUrls(props.token);
      setAllUrls(getAllUrlsData);
      setLoading(false);
    } catch (err) {
      setLoading(false);

      console.log(err);
    }
  };

  const handleUpdateProduct = async () => {
    try {
      setLoading(true);

      if (!props.user) return;
      const postData = await shortenUrl(
        {
          maxUses: openEdit.product.maxUses,
          originalUrl: openEdit.product.originalUrl,
        },
        props.token
      );

      const getAllUrlsData = await getAllUrls(props.token);
      setAllUrls(getAllUrlsData);

      setOpenEdit((prev) => ({
        open: false,
        productId: "",
        product: prev.product,
      }));
      setLoading(false);
    } catch (err) {
      setLoading(false);

      console.log(err);
    }
  };

  const handleCopy = (url: IUrl) => {
    const fullUrl = `${base_url}/user/redirectUrl/${url.userId}/${url.hash}`;
    navigator.clipboard
      .writeText(fullUrl)
      .then(() => {
        alert("URL copied to clipboard");
      })
      .catch((err) => {
        console.error("Failed to copy: ", err);
      });
  };

  return (
    <div className="relative overflow-x-auto" ref={ref}>
      <table className="w-full text-sm text-left  text-gray-500 dark:text-gray-400">
        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
          <tr>
            <th scope="col" className="px-6 py-3">
              original Url
            </th>
            <th scope="col" className="px-6 py-3">
              hash
            </th>
            <th scope="col" className="px-6 py-3">
              clicks
            </th>
            <th scope="col" className="px-6 py-3">
              maxUses
            </th>
            <th scope="col" className="px-6 py-3">
              remainingUses
            </th>
            <th scope="col" className="px-6 py-3">
              full Url
            </th>
            <th scope="col" className="px-6 py-3">
              edit
            </th>
            <th scope="col" className="px-6 py-3">
              delete
            </th>
          </tr>
        </thead>
        <tbody>
          {allUrls.map((url, index) => (
            <tr
              key={index}
              className="bg-white border-b dark:bg-gray-800 dark:border-gray-700"
            >
              <th
                scope="row"
                className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
              >
                {!(openEdit.open && openEdit.productId === url._id) ? (
                  url.originalUrl
                ) : (
                  <input
                    placeholder="name"
                    value={openEdit.product.originalUrl}
                    onChange={(e) =>
                      setOpenEdit((prev) => {
                        let temp = { ...prev };
                        temp.product.originalUrl = e.target.value;
                        return temp;
                      })
                    }
                    className="text-black"
                  />
                )}
              </th>
              <td className="px-6 py-4">{url.hash}</td>
              <td className="px-6 py-4">{url.clicks}</td>
              <td className="px-6 py-4">
                {!(openEdit.open && openEdit.productId === url._id) ? (
                  url.maxUses
                ) : (
                  <input
                    placeholder="name"
                    value={openEdit.product.maxUses}
                    type="number"
                    className="text-black"
                    onChange={(e) =>
                      setOpenEdit((prev) => {
                        let temp = { ...prev };
                        temp.product.maxUses = parseInt(e.target.value);
                        return temp;
                      })
                    }
                  />
                )}
              </td>

              <td className="px-6 py-4">{url.remainingUses}</td>

              <td className="px-6 py-4">
                <button
                  onClick={() => handleCopy(url)}
                  className="px-4 py-2 bg-blue-500 text-white rounded"
                >
                  Copy URL
                </button>
              </td>

              <td className="px-6 py-4 cursor-pointer">
                {!(openEdit.open && openEdit.productId === url._id) ? (
                  <MdEdit
                    onClick={() => {
                      setOpenEdit((prev) => ({
                        open: true,
                        productId: url._id,
                        product: url,
                      }));
                    }}
                  />
                ) : (
                  <button onClick={handleUpdateProduct} disabled={loading}>
                    {loading ? "Loading..." : "submit"}
                  </button>
                )}
              </td>
              <td className="px-6 py-4 cursor-pointer">
                <MdDelete onClick={() => handleDelete(url.hash)} />
              </td>
            </tr>
          ))}

          {showNewRow && (
            <tr className="bg-white dark:bg-gray-800">
              <th
                scope="row"
                className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
              >
                <input
                  type="text"
                  className="text-black w-16 md:w-auto"
                  value={newRow.originalUrl}
                  placeholder="name"
                  onChange={(e) => {
                    setNewRow((prev) => ({
                      ...prev,
                      originalUrl: e.target.value,
                    }));
                  }}
                />
              </th>
              <td className="px-6 py-4">
                <input
                  type="text"
                  className="text-black w-12  md:w-auto"
                  value={"sdads"}
                  placeholder="color"
                  disabled={true}
                  onChange={(e) => {
                    setNewRow((prev) => ({
                      ...prev,
                      color: e.target.value,
                    }));
                  }}
                />
              </td>
              <td className="px-6 py-4">
                <input
                  type="text"
                  className="text-black w-20 md:w-auto"
                  value={0}
                  disabled={true}
                  placeholder="category"
                  onChange={(e) => {
                    setNewRow((prev) => ({
                      ...prev,
                      category: e.target.value,
                    }));
                  }}
                />
              </td>
              <td className="px-6 py-4">
                <input
                  type="text"
                  className="text-black w-8 md:w-auto"
                  value={newRow.maxUses}
                  placeholder="price"
                  onChange={(e) => {
                    if (!isNaN(parseInt(e.target.value))) {
                      setNewRow((prev) => ({
                        ...prev,
                        maxUses: parseInt(e.target.value),
                      }));
                    } else {
                      setNewRow((prev) => ({
                        ...prev,
                        maxUses: 0,
                      }));
                    }
                  }}
                />
              </td>

              <td className="px-6 py-4">
                <input
                  type="text"
                  className="text-black w-20 md:w-auto"
                  value={0}
                  disabled={true}
                  placeholder="category"
                  onChange={(e) => {
                    setNewRow((prev) => ({
                      ...prev,
                      category: e.target.value,
                    }));
                  }}
                />
              </td>

              <td className="px-6 py-4">
                <input
                  type="text"
                  className="text-black w-20 md:w-auto"
                  value={"sh.com"}
                  disabled={true}
                  placeholder="category"
                  onChange={(e) => {
                    setNewRow((prev) => ({
                      ...prev,
                      category: e.target.value,
                    }));
                  }}
                />
              </td>
            </tr>
          )}
        </tbody>
      </table>
      {showNewRow ? (
        <button
          className="text-2xl text-white w-full flex justify-center cursor-pointer text-center "
          onClick={handlePostUrl}
          disabled={loading}
        >
          <p className="rounded-md bg-[#00df9a] px-2 py-2">
            {loading ? "Loading.." : "submit"}
          </p>
        </button>
      ) : (
        <div
          className="text-2xl text-white w-full flex justify-center cursor-pointer text-center"
          onClick={() => {
            setShowNewRow(!showNewRow);
          }}
        >
          <IoAddCircleOutline size={35} />
          <p>Add a product</p>
        </div>
      )}
    </div>
  );
});

Table.displayName = "Table";
export default Table;
