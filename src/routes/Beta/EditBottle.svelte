<script lang="ts" context="module">
import { getYear } from 'date-fns';
import { z } from 'zod';
export const bottleSchema = z.object({
	wineName: z
		.string()
		.min(1, { message: 'Name cannot be empty' })
		.max(30, { message: 'Name cannot be longer than 30 characters' }),
	producer: z
		.string()
		.min(1, { message: 'Producer cannot be empty' })
		.max(30, { message: 'Producer cannot be longer than 30 characters' }),
	vintage: z
		.number()
		.min(1900, { message: 'Vintage must be after 1900' })
		.max(getYear(new Date()), { message: 'Vintage must be before the current year' })
		.default(2022),
	purchased: z
		.string()
		.refine((v) => v)
		.optional(),
	consumed: z
		.string()
		.refine((v) => v)
		.optional()
});
export type BottleFormSchema = typeof bottleSchema;
</script>

<script lang="ts">
import { page } from '$app/stores';
import { buttonVariants } from '$lib/components/ui/button';
import { Calendar } from '$lib/components/ui/calendar';
import * as Form from '$lib/components/ui/form';
import * as Popover from '$lib/components/ui/popover';
import { cn } from '$lib/utils';
import {
	CalendarDate,
	DateFormatter,
	getLocalTimeZone,
	parseDate,
	today,
	type DateValue
} from '@internationalized/date';
import { Calendar as CalendarIcon } from 'lucide-svelte';
import type { SuperValidated } from 'sveltekit-superforms';
import { superForm } from 'sveltekit-superforms/client';
import SuperDebug from 'sveltekit-superforms/client/SuperDebug.svelte';
export let form: SuperValidated<BottleFormSchema> = $page.data.bottleForm;
const df = new DateFormatter('en-US', {
	dateStyle: 'long'
});

let open = false;

const theForm = superForm(form, {
	validators: bottleSchema,
	taintedMessage: null
});

const { form: formStore } = theForm;
let value1: DateValue | undefined = $formStore.purchased
	? parseDate($formStore.purchased)
	: undefined;
let value2: DateValue | undefined = $formStore.consumed
	? parseDate($formStore.consumed)
	: undefined;
let placeholder: DateValue = today(getLocalTimeZone());

/* function closeAndFocusTrigger(triggerId: string) {
	open = false;
	tick().then(() => {
		document.getElementById(triggerId)?.focus();
	});
} */
</script>

<Form.Root
	form={theForm}
	schema={bottleSchema}
	debug={true}
	let:enhance
	asChild
	controlled
	let:config
	action="?/newBottle"
>
	<form method="POST" action="?/newBottle" use:enhance>
		<Form.Item>
			<Form.Field config={config} name="wineName">
				<div class="flex">
					<Form.Label class="p-0.5">Wine Name</Form.Label>
					<Form.Validation class="ml-8" />
				</div>
				<Form.Input />
				<Form.Description>The name of this wine bottle.</Form.Description>
			</Form.Field>
		</Form.Item>
		<Form.Item>
			<Form.Field config={config} name="producer">
				<div class="flex">
					<Form.Label class="p-0.5">Producer</Form.Label>
					<Form.Validation class="ml-8" />
				</div>
				<Form.Input />

				<Form.Description>The producer of this wine bottle.</Form.Description>
			</Form.Field>
		</Form.Item>
		<Form.Item>
			<Form.Field config={config} name="vintage">
				<div class="flex">
					<Form.Label class="p-0.5">Vintage</Form.Label>
					<Form.Validation class="ml-8" />
				</div>
				<Form.Select>
					<Form.SelectTrigger placeholder="2022" />
					<Form.SelectContent>
						{#each { length: 20 } as _, i}
							<Form.SelectItem
								value={new Date().getFullYear()-20 + i}
								label={`${new Date().getFullYear()-20 + i}`}
							>
								{new Date().getFullYear()-20 + i}
							</Form.SelectItem>
						{/each}
					</Form.SelectContent>
				</Form.Select>

				<Form.Description>The vintage of this wine bottle.</Form.Description>
			</Form.Field>
		</Form.Item>
		<Form.Item>
			<Form.Field config={config} name="purchased">
				<Form.Label>Purchased Date</Form.Label>
				<Popover.Root>
					<Form.Control id="purchased" let:attrs>
						<Popover.Trigger
							id="purchased"
							{...attrs}
							class={cn(
              buttonVariants({ variant: "outline" }),
              "w-[280px] justify-start pl-4 text-left font-normal",
              !value1 && "text-muted-foreground"
            )}
						>
							{value1
              ? df.format(value1.toDate(getLocalTimeZone()))
              : "Pick a date"}
							<CalendarIcon class="ml-auto h-4 w-4 opacity-50" />
						</Popover.Trigger>
					</Form.Control>
					<Popover.Content class="w-auto p-0" side="top">
						<Calendar
							bind:value={value1}
							bind:placeholder={placeholder}
							minValue={new CalendarDate(1900, 1, 1)}
							maxValue={today(getLocalTimeZone())}
							calendarLabel="Purchased Date"
							initialFocus
							onValueChange={(v) => {
                      if (v) {
                        $formStore.purchased = v.toString();
                      } else {
                        $formStore.purchased = "01/01/1900";
                      }
                    }}
						/>
					</Popover.Content>
				</Popover.Root>
				<Form.Description>The date this wine bottle was purchased.</Form.Description>
				<Form.Validation />
			</Form.Field>
		</Form.Item>
		<Form.Item>
			<Form.Field config={config} name="consumed">
				<Form.Label>Consumed Date</Form.Label>
				<Popover.Root>
					<Form.Control id="consumed" let:attrs>
						<Popover.Trigger
							id="consumed"
							{...attrs}
							class={cn(
              buttonVariants({ variant: "outline" }),
              "w-[280px] justify-start pl-4 text-left font-normal",
              !value2 && "text-muted-foreground"
            )}
						>
							{value2
              ? df.format(value2.toDate(getLocalTimeZone()))
              : "Pick a date"}
							<CalendarIcon class="ml-auto h-4 w-4 opacity-50" />
						</Popover.Trigger>
					</Form.Control>
					<Popover.Content class="w-auto p-0" side="top">
						<Calendar
							bind:value={value2}
							bind:placeholder={placeholder}
							minValue={new CalendarDate(1900, 1, 1)}
							maxValue={today(getLocalTimeZone())}
							calendarLabel="Consumed Date"
							initialFocus
							onValueChange={(v) => {
                      if (v) {
                        $formStore.consumed = v.toString();
                      } else {
                        $formStore.consumed = "01/01/1900";
                      }
                    }}
						/>
					</Popover.Content>
				</Popover.Root>
				<Form.Description>The date this wine bottle was consumed.</Form.Description>
				<Form.Validation />
			</Form.Field>
		</Form.Item>
		<Form.Button class="variant-filled-surface btn">Submit</Form.Button>
	</form>
</Form.Root>
<SuperDebug data={form} />
