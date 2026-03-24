import { useState } from 'react';
import AdminViewHeader from '@/components/layouts/admin/header';
import { Button } from '@/components/ui/button';
import { createFileRoute } from '@tanstack/react-router';
import { faker } from "@faker-js/faker";
import { db } from '@/lib/db';
import { id } from '@instantdb/react';
import { toast } from 'sonner';
import { ProductCard } from '@/components/layouts/public/product-card';

export const Route = createFileRoute('/(admin)/admin/users/')({
    component: RouteComponent,
});
const images = [
    "ece4fddf-8023-4b27-b755-9d62dc115430",
    "ea5460b9-e613-4ea9-b23f-cd541f747d76",
    "45ad3bc4-acf1-4422-a179-4d574551528b",
    "dd07dcc7-0912-464a-b09d-93a4f29bbd44",
    "894fc3d1-970f-451b-a66a-b6b5bd04a2ce",
    "17f790e4-b080-4b06-ac92-f0129f252feb",
    "7f7555f3-6ef0-4a97-9688-76647ef9d49b",
    "a8b65b2b-9e2d-4784-98d3-79a1306cff83",
    "21988af4-76ef-4734-902d-71ceb6e8e9a6",
    "65266b84-16b0-441d-bc96-5d48d1932dea",
    "1954e42f-21b3-4570-bb4d-87e01bbd7271",
    "d14e1c4a-affb-4a18-8a3c-2e78b9eebb3a",
    "6228a56c-3049-4652-bf56-7b9ecf0604ff",
    "31309267-fcb8-49d3-bd89-ee634a9ae4e4",
    "5b02d683-169e-4859-9fc1-d90f883d4aae",
    "2c96bd3c-1a99-4678-a6a4-7c9092cb642c",
    "ef6a1e53-195b-45ff-b3bf-c2c746ed0271",
    "0ab5e8bd-1ce4-4b45-b352-08014b841ab0",
    "46f98360-3cac-4762-9e37-de9845c551f5",
    "0e6ae9e0-438d-4177-89cf-82e93e3a50da",
    "e6b5b2ad-90c9-43ad-a95d-d2dad4b5926c",
];
const categories = [
    "eddd142f-fae2-48c3-8e90-03f387a52d77",
    "85bd0c21-79f9-44de-a1ce-325132b212bf",
    "25d784f5-6911-419b-a917-2faa1b75258d",
    "1d032e22-6009-4cbb-9425-337b944da3dd",
    "083decc2-36e2-41dc-958a-6dd3c23761c7",
    "00691b52-90c5-464c-8d11-84ac853a74c3",
    "3ed753d3-1d80-43b0-9244-fcbf4b2cbe6b",
    "8757543c-7b10-4f11-b6b2-5495b9c39f2c",
    "57c17567-5492-4ffd-8f4e-16cd439a1fb3",
];
const tags = [
    "b6bcfc85-8e00-4402-845b-13a6df3679bc",
    "752583f3-6f6f-4d77-8ffe-27bb34bfbd66",
    "28b3f050-364f-422e-bfc7-c8e574ae976b",
    "fdc0295e-5682-4569-a66b-338bb1073478",
    "1ab36167-bf3a-4d19-bab5-26c6ca36b8cc",
    "1ff76510-b01a-4fab-b48d-18c401b6a1ca",
    "fe222aa7-e4db-4503-92e6-65b8b209e819",
    "4fea4a7e-e785-4e96-8670-c141cb0b41dd",
    "9f5792c6-dc45-40fb-9c63-1ef140165000",
    "062ef15f-4a42-478a-8618-f7907f6deacb",
    "9ae4e219-d2cf-45f5-b842-f108f909c2e7",
    "680aa26f-445b-465a-aeab-ccd26dc86500",
    "8366cdc4-c978-48b7-8b43-f7031e5aa2ac",
    "f6b3f2a5-1091-47d3-9cf1-64096343af7f",
    "3eba389a-699f-462e-be01-c39e7e3c22e5",
    "e816b19e-8c2d-434c-835f-aa5b2cd54183",
    "5664816a-c652-4487-afa8-7eccfae86ee3",
    "79f4c911-dc92-4f95-980c-b1926602635b",
    "dc45d333-3229-4883-9c64-c519115fa904",
    "67d67f8f-9c82-4844-b340-cc99537527d5",
    "e08fbafb-20cc-4aa2-a649-475b577c77d8",
    "ee08521f-76d2-417f-9b44-900201f485b1",
    "64e46f8e-72cd-46ce-82ac-6511a92ec715",
    "ecaa35ef-2ac7-4904-8d13-95e2d9f2d40a",
    "d9dd308e-53cd-4322-89e9-d63286f700b2",
    "ece027f6-c5b4-4a5b-807a-76c925e7d2a6",
    "cc4603bc-852c-41b1-a037-96b4aeb8f883",
    "8a10d5d5-1f64-40da-addc-801b58136ea0",
    "567b6aa5-03bf-441c-86af-bf8aecb97973",
    "3f638839-d88c-466d-aa98-920e1507bf6c",
    "22ebd44e-5692-4485-974a-a6b2fb2cdaec",
    "2693cf41-fdf1-47fc-8665-5ab84faf5ce8",
    "12c66937-1913-473e-a11f-f27035077988",
    "5216ecfe-6967-46b9-b087-c335a8fc6488",
    "3aef7506-e2e7-4f73-81ea-39e07389a27b",
    "40ed9cf8-eb4c-483a-aeab-618f7acab485",
    "a91aa117-c683-4d02-a060-45ea1b2974d8",
    "3d57da6b-1b5e-4f04-aabc-cf66758f5cd8",
    "43447dcb-9e33-4fd1-97fe-719bf234f24b",
    "b78b1934-0062-436e-9d7d-43e596475144",
    "56ee16ab-0f22-4924-b4fd-a23c1cba06af",
    "ae74bc1a-f85d-4cab-967d-986298b78657",
    "b5800f76-aacf-4f33-9923-b4784799c2a7",
    "08f1fec0-c091-44f1-874d-d4961aca4653",
    "190dc1be-4a37-4829-b624-8dcdf1062ce3",
    "629178ab-d156-4b85-9535-966b0607927e",
    "a24acc8c-8ec8-4915-b956-c52898c20e92",
    "4e1bea88-4527-4c4f-8097-3df19ae38b77",
    "58143b7c-8e5b-447c-979c-d1354028d531",
    "e5032cca-93bf-447f-8319-1fc3dc867d77"
]



function RouteComponent() {
    const [loading, setLoading] = useState(false);
    const { data } = db.useQuery({ products: { images: {}, category: {}, tags: {}, thumbnail: {} } })

    const generateProduct = async () => {
        setLoading(true);
        try {
            let x = 0
            while (x < 20) {
                await db.transact(
                    db.tx.products[id()].update({
                        name: faker.commerce.productName(),
                        price: Number(faker.commerce.price()),
                        barcode: faker.string.alphanumeric(13),
                        brand: faker.company.name(),
                        compareAtPrice: faker.number.int({ min: 0, max: 200 }),
                        costPrice: faker.number.int({ min: 10, max: 100 }),
                        createdAt: new Date(),
                        description: faker.commerce.productDescription(),
                        featured: faker.datatype.boolean(),
                        height: faker.number.int({ min: 0, max: 100 }),
                        inventory: {
                            color: faker.helpers.arrayElements(['red', 'green', 'white', 'blue', 'black'], { min: 1, max: 3 }),
                            size: faker.helpers.arrayElements(['xs', 's', 'm', 'l', 'xl'], { min: 1, max: 3 }),
                        },
                        length: faker.number.int({ min: 0, max: 100 }),
                        metaDescription: faker.commerce.productDescription(),
                        metaTitle: faker.commerce.productName(),
                        shortDescription: faker.commerce.productDescription().slice(0, 100),
                        rating: faker.number.float({ min: 0, max: 5, multipleOf: 0.1 }),
                        reviewCount: faker.number.int({ min: 0, max: 1000 }),
                        sku: faker.string.alphanumeric(8).toUpperCase(),
                        slug: faker.helpers.slugify(faker.commerce.productName()),
                        specialOffer: faker.datatype.boolean() ? faker.lorem.sentence() : '',
                        status: faker.helpers.arrayElement(['draft', 'published', 'archived']),
                        stock: faker.number.int({ min: 0, max: 500 }),
                        taxClass: faker.helpers.arrayElement(['standard', 'reduced', 'zero']),
                        type: faker.helpers.arrayElement(['simple', 'variable', 'grouped']),
                        weight: faker.number.int({ min: 0, max: 20 }),
                        width: faker.number.int({ min: 0, max: 100 }),
                    }).link({
                        category: categories[Math.floor(Math.random() * categories.length)],
                        // For images, select 2–5 random image IDs
                        images: faker.helpers.arrayElements(images, { min: 2, max: 5 }),
                        // For tags, select 1–4 random tag IDs
                        tags: faker.helpers.arrayElements(tags, { min: 1, max: 4 }),
                        thumbnail: faker.helpers.arrayElement(images),
                    })
                );
                x++
            }
            toast.success('Product created successfully')
        } catch (error) {
            toast.error("Somthing went wrong");
        } finally {
            setLoading(false);
        }
    };

    const generateBanners = async () => {
        setLoading(true);
        try {
            // Create a banner
            await db.transact(
                db.tx.banners[id()].update({
                    title: faker.lorem.sentence({ min: 3, max: 8 }),
                    active: faker.datatype.boolean(),
                    createdAt: new Date(),
                    image: faker.helpers.arrayElement(images), // use an existing image ID
                    link: faker.internet.url(),
                    subtitle: faker.lorem.sentence({ min: 5, max: 15 }),
                })
            );

            // Create a promotional banner
            await db.transact(
                db.tx.promotionalBanners[id()].update({
                    active: faker.datatype.boolean(),
                    buttonText: faker.lorem.word({ length: { min: 3, max: 8 } }),
                    image: faker.helpers.arrayElement(images),
                    createdAt: new Date(),
                    link: faker.internet.url(),
                    order: faker.number.int({ min: 0, max: 100 }),
                    subtitle: faker.lorem.sentence({ min: 5, max: 15 }),
                    title: faker.lorem.sentence({ min: 3, max: 8 }),
                })
            );

            toast.success('Banners created successfully');
        } catch (error) {
            console.error('Failed to create banners:', error);
            toast.error("Failed to create banners")
        } finally {
            setLoading(false);
        }
    };


    return (
        <main className="">
            <AdminViewHeader />
            <div className="p-16">
                <Button onClick={() => generateProduct()} disabled={loading}>
                    {loading ? 'Creating...' : 'Seed Product'}
                </Button>
            </div>


            <div className="p-2 gap-4 md:p-12 grid grid-cols-2 md:grid-cols-4">

                {
                    data?.products.map((product) => <ProductCard key={product.id} product={product} />)
                }

            </div>

        </main>
    );
}