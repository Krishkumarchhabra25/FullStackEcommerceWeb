import PropTypes from 'prop-types';
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "../ui/select";

function CommonForm({ formControls, formData, setFormData, onSubmit, buttonText  }) {
  function renderInputByComponents(controllItem) {
    let element = null;
    const value = formData[controllItem.name] || "";

    switch (controllItem.componentType) {
      case 'input':
        element = (
          <Input
            name={controllItem.name}
            placeholder={controllItem.placeholder}
            id={controllItem.name}
            type={controllItem.type}
            value={value}
            onChange={(event) => setFormData({
              ...formData,
              [controllItem.name]: event.target.value
            })}
          />
        );
        break;

      case 'select':
        element = (
          <Select
            onValueChange={(value) => setFormData({
              ...formData,
              [controllItem.name]: value
            })}
            value={value}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder={controllItem.label} />
            </SelectTrigger>
            <SelectContent>
              {controllItem.options && controllItem.options.length > 0
                ? controllItem.options.map((optionItem) => (
                    <SelectItem key={optionItem.id} value={optionItem.id}>
                      {optionItem.label}
                    </SelectItem>
                  ))
                : null}
            </SelectContent>
          </Select>
        );
        break;

      case 'textarea':
        element = (
          <Input
            name={controllItem.name}
            placeholder={controllItem.placeholder}
            id={controllItem.name}
            type={controllItem.type}
            value={value}
            onChange={(event) => setFormData({
              ...formData,
              [controllItem.name]: event.target.value
            })}
          />
        );
        break;

      default:
        element = (
          <Input
            name={controllItem.name}
            placeholder={controllItem.placeholder}
            id={controllItem.name}
            type={controllItem.type}
            value={value}
            onChange={(event) => setFormData({
              ...formData,
              [controllItem.name]: event.target.value
            })}
          />
        );
        break;
    }
    return element;
  }

  return (
    <form onSubmit={onSubmit}>
      <div className="flex flex-col gap-3">
        {formControls.map((controllItem) => (
          <div className="grid w-full gap-1.5" key={controllItem.name}>
            <Label className="mb-1">{controllItem.label}</Label>
            {renderInputByComponents(controllItem)}
          </div>
        ))}
      </div>
      <Button  type='submit' className='mt-2 w-full'>{buttonText || 'Submit'}</Button>
    </form>
  );
}

// Add prop validation
CommonForm.propTypes = {
  formControls: PropTypes.arrayOf(PropTypes.shape({
    name: PropTypes.string.isRequired,
    label: PropTypes.string,
    placeholder: PropTypes.string,
    componentType: PropTypes.string.isRequired,
    type: PropTypes.string,
    options: PropTypes.arrayOf(PropTypes.shape({
      id: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired
    }))
  })).isRequired,
  formData: PropTypes.object.isRequired,
  setFormData: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  buttonText: PropTypes.string
};

export default CommonForm;
